;; ============================================
;; Mock Oracle Contract
;; Provides BTC/STX price data for development and testing
;; ============================================

;; ============================================
;; Error Constants
;; ============================================
(define-constant ERR_NOT_OWNER (err u100))
(define-constant ERR_ALREADY_INITIALIZED (err u101))
(define-constant ERR_NOT_UPDATER (err u102))
(define-constant ERR_NOT_INITIALIZED (err u103))

;; ============================================
;; Data Variables
;; ============================================
(define-data-var owner (optional principal) none)
(define-data-var updater (optional principal) none)
(define-data-var initialized bool false)
(define-data-var btc-stx-price uint u0)

