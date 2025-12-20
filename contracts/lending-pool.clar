;; ============================================
;; Lending Pool Contract
;; Core structure for the dual-asset lending protocol
;; ============================================

;; ====== temp test ======
(define-data-var temp-counter uint u0)

(define-public (increment-counter)
  (begin
    (var-set temp-counter (+ (var-get temp-counter) u1))
    (ok (var-get temp-counter))
  )
)

(define-public (decrement-counter)
  (begin
    (if (> (var-get temp-counter) u0)
      (var-set temp-counter (- (var-get temp-counter) u1))
      (var-set temp-counter u0)
    )
    (ok (var-get temp-counter))
  )
)

(define-read-only (get-counter)
  (ok (var-get temp-counter))
)
;; ====== temp test ======

;; ============================================
;; Error Constants
;; ============================================
(define-constant ERR_INVALID_WITHDRAW_AMOUNT (err u100))
(define-constant ERR_EXCEEDED_MAX_BORROW (err u101))
(define-constant ERR_CANNOT_BE_LIQUIDATED (err u102))
(define-constant ERR_MUST_WITHDRAW_BEFORE_NEW_DEPOSIT (err u103))
(define-constant ERR_INVALID_ORACLE (err u104))
(define-constant ERR_INVALID_SBTC_CONTRACT (err u105))
(define-constant ERR_INVALID_DEX_CONTRACT (err u106))

;; ============================================
;; Protocol Constants
;; ============================================
(define-constant LTV_PERCENTAGE u70)
(define-constant INTEREST_RATE_PERCENTAGE u10)
(define-constant LIQUIDATION_THRESHOLD_PERCENTAGE u100)
(define-constant ONE_YEAR_IN_SECS u31556952)

;; ============================================
;; Data Variables
;; ============================================
(define-data-var total-sbtc-collateral uint u0)
(define-data-var total-stx-deposits uint u1)
(define-data-var total-stx-borrows uint u0)
(define-data-var last-interest-accrual uint stacks-block-time)
(define-data-var cumulative-yield-bips uint u0)

;; ============================================
;; Traits
;; ============================================
(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; ============================================
;; Maps
;; ============================================
(define-map collateral
  { user: principal }
  { amount: uint }
)

(define-map deposits
  { user: principal }
  {
    amount: uint,
    yield-index: uint,
  }
)

(define-map borrows
  { user: principal }
  {
    amount: uint,
    last-accrued: uint,
  }
)

;; ============================================
;; Public Functions
;; ============================================
(define-public (get-sbtc-stx-price)
  (begin
    ;; Verify oracle contract exists and get its hash (Clarity 4)
    (unwrap! (contract-hash? .mock-oracle-v1) ERR_INVALID_ORACLE)

    ;; Call oracle to get price.
    ;; Note: `restrict-assets?` usage was causing a compile error in this repo setup,
    ;; so this is a direct contract call for now.
    (contract-call? .mock-oracle-v1 get-price)
  )
)

(define-public (deposit-stx (amount uint))
  (let (
      (existing (map-get? deposits { user: tx-sender }))
      (deposited-stx (default-to u0 (get amount existing)))
    )
    ;; Enforce: must withdraw before making a new deposit
    (asserts! (is-eq deposited-stx u0) ERR_MUST_WITHDRAW_BEFORE_NEW_DEPOSIT)

    ;; Accrue interest before changing totals / indices
    (unwrap-panic (accrue-interest))

    ;; Transfer STX from user to contract
    ;; Use the contract principal as recipient
    (unwrap! (stx-transfer? amount tx-sender .stackslend-v1) (err u1))

    ;; Record deposit + yield index snapshot
    (map-set deposits
      { user: tx-sender }
      {
        amount: (+ deposited-stx amount),
        yield-index: (var-get cumulative-yield-bips)
      }
    )

    ;; Update total deposits
    (var-set total-stx-deposits (+ (var-get total-stx-deposits) amount))

    (ok true)
  )
)

(define-public (withdraw-stx (amount uint))
  (let (
      (deposit (unwrap! (map-get? deposits { user: tx-sender }) ERR_INVALID_WITHDRAW_AMOUNT))
      (deposited-stx (get amount deposit))
      (yield-index (get yield-index deposit))
    )
    ;; Validate withdrawal amount doesn't exceed deposited amount
    (asserts! (>= deposited-stx amount) ERR_INVALID_WITHDRAW_AMOUNT)
    
    ;; Accrue interest before withdrawal
    (unwrap-panic (accrue-interest))
    
    ;; Calculate pending yield and new amount
    (let (
        (pending-yield (unwrap-panic (get-pending-yield tx-sender)))
        (new-amount (- deposited-stx amount))
      )
      ;; Update deposits map
      (if (is-eq new-amount u0)
        ;; Full withdrawal - delete entry
        (map-delete deposits { user: tx-sender })
        ;; Partial withdrawal - update entry
        (map-set deposits
          { user: tx-sender }
          {
            amount: new-amount,
            yield-index: (var-get cumulative-yield-bips)
          }
        )
      )
      
      ;; Update total deposits
      (var-set total-stx-deposits (- (var-get total-stx-deposits) amount))
      
      ;; Transfer STX + yield to user
      ;; Note: For now, skip the transfer in simnet - will work in production with proper as-contract
      ;; TODO: Fix this when as-contract becomes available in this Clarity version
      ;; (try! (stx-transfer? (+ amount pending-yield) .stackslend-v1 tx-sender))
      
      (ok true)
    )
  )
)

(define-public (borrow-stx
    (token <sip-010-trait>)
    (collateral-amount uint)
    (amount-stx uint)
  )
  (let (
      (borrow (map-get? borrows { user: tx-sender }))
      (current-debt (unwrap! (get-debt tx-sender) (err u1)))
      (collateral-entry (map-get? collateral { user: tx-sender }))
      (deposited-sbtc (default-to u0 (get amount collateral-entry)))
      (new-collateral (+ deposited-sbtc collateral-amount))
      (price-data (unwrap! (get-sbtc-stx-price) ERR_INVALID_ORACLE))
      (price price-data)
    )
    ;; Verify token is the expected sBTC contract (Clarity 4 verification)
    ;; TODO: In production, switch this back to 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
    ;; For local testing, we use the local .sbtc-token contract
    (asserts! (is-eq (contract-of token) .sbtc-token) ERR_INVALID_SBTC_CONTRACT)

    ;; Calculate max borrowable amount in STX
    ;; (collateral * price * LTV) / 100
    (let (
        (collateral-value-in-stx (* new-collateral price))
        (max-borrow (/ (* collateral-value-in-stx LTV_PERCENTAGE) u100))
        (new-debt (+ current-debt amount-stx))
      )
      ;; Validate new debt doesn't exceed max borrow
      (asserts! (<= new-debt max-borrow) ERR_EXCEEDED_MAX_BORROW)
      
      ;; Accrue interest global
      (unwrap-panic (accrue-interest))
      
      ;; Update borrows map
      (map-set borrows
        { user: tx-sender }
        {
          amount: new-debt,
          last-accrued: stacks-block-time
        }
      )
      
      ;; Update total borrows
      (var-set total-stx-borrows (+ (var-get total-stx-borrows) amount-stx))
      
      ;; Update collateral map
      (map-set collateral
        { user: tx-sender }
        { amount: new-collateral }
      )
      
      ;; Update total collateral
      (var-set total-sbtc-collateral (+ (var-get total-sbtc-collateral) collateral-amount))
      
      ;; Transfer sBTC from user to contract using trait
      (unwrap! 
        (contract-call? token transfer
          collateral-amount
          tx-sender
          .stackslend-v1
          none
        )
        (err u1)
      )
      
      ;; Transfer STX from contract to user
      ;; Note: For now, skip the transfer in simnet - will work in production with proper as-contract
      ;; TODO: Fix this when as-contract becomes available in this Clarity version
      ;; (try! (stx-transfer? amount-stx .stackslend-v1 tx-sender))
      
      (ok true)
    )
  )
)

(define-public (repay)
  (ok true)
)

(define-public (liquidate (user principal))
  (ok true)
)

;; ============================================
;; Read-Only Functions
;; ============================================
(define-read-only (get-pending-yield (user principal))
  (let (
      (deposit (map-get? deposits { user: user }))
      (amount-stx (default-to u0 (get amount deposit)))
      (yield-index (default-to u0 (get yield-index deposit)))
    )
    ;; Calculate delta between current cumulative yield and user's snapshot
    (let (
        (delta (- (var-get cumulative-yield-bips) yield-index))
        (pending-yield (/ (* amount-stx delta) u10000))
      )
      (ok pending-yield)
    )
  )
)

(define-read-only (get-debt (user principal))
  (let (
      (borrow (map-get? borrows { user: user }))
      (amount (default-to u0 (get amount borrow)))
      (last-accrued (default-to (var-get last-interest-accrual) (get last-accrued borrow)))
    )
    (if (> amount u0)
      (let (
          (current-time stacks-block-time)
          (dt (- current-time last-accrued))
          (interest-numerator (* u10000 (* (* amount INTEREST_RATE_PERCENTAGE) dt)))
          (interest-denominator (* ONE_YEAR_IN_SECS u100))
          (interest (/ interest-numerator interest-denominator))
        )
        (ok (+ amount interest))
      )
      (ok u0)
    )
  )
)

;; ============================================
;; Private Functions
;; ============================================
(define-private (accrue-interest)
  (let (
      (current-time stacks-block-time)
      (last-accrual (var-get last-interest-accrual))
      (dt (- current-time last-accrual))
    )
    (if (> dt u0)
      (let (
          (total-borrows (var-get total-stx-borrows))
          (interest-numerator (* u10000 (* (* total-borrows INTEREST_RATE_PERCENTAGE) dt)))
          (interest-denominator (* ONE_YEAR_IN_SECS u100))
          (interest (/ interest-numerator interest-denominator))
          (new-yield (/ interest (var-get total-stx-deposits)))
        )
        (var-set last-interest-accrual current-time)
        (var-set cumulative-yield-bips
          (+ (var-get cumulative-yield-bips) new-yield)
        )
        (ok true)
      )
      (ok true)
    )
  )
)
