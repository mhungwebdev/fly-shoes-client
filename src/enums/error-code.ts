enum ErrorCode {
    NoError,
    /**
     * Dữ liệu đã được sử dụng
     */
    IsUsed,
    /**
     * Email không hợp lệ
     */
    EmailInValid,
    /**
     * Số điện thoại không hợp lệ
     */
    PhoneInValid,
    /**
     * Trùng dữ liệu
     */
    UniqueInValid,
    /**
     * Quá dài
     */
    MaxLengthInValid,
    /**
     * Thiếu dữ liệu
     */
    RequiredInValid,
    /**
     * Đã tồn tại
     */
    Exist,
    ProductNotEnough,
    VoucherNotEnough
}

export default ErrorCode