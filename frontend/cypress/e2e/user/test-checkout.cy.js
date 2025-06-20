describe('Luồng mua hàng thành công', () => {
  beforeEach(() => {
    cy.loginByApi();
  });

  it('Chọn sản phẩm và mua ngay với phương thức thanh toán khi nhận hàng', () => {
    cy.visit('/product-type/ghe-sofa');
    cy.contains('Sofa MOHO LYNGBY').click();
    cy.contains('Mua Ngay').click();

    cy.url().should('include', '/checkout');

    cy.get('input[name="fullname"]').type('Nguyễn Thị Bích Ngân');
    cy.get('input[name="phone"]').type('0905569875');

    cy.get('input').eq(4).type('Hồ Chí Minh');
    cy.contains('li', 'Hồ Chí Minh').click();

    cy.get('input').eq(5).type('Quận 12');
    cy.contains('li', 'Quận 12').click();

    cy.get('input').eq(6).type('Đông Hưng Thuận');
    cy.contains('li', 'Đông Hưng Thuận').click();

    cy.get('input').eq(7).type('Nguyễn Văn Quá');
    cy.get('input').eq(8).type('11');
    cy.contains('Thanh Toán Khi Nhận Hàng').click();
    cy.contains('Xác Nhận Mua Hàng').click();

    // Chờ modal xuất hiện
    cy.wait(1000);
    cy.get('.modal-footer button').eq(1).click({ force: true });

    // Kiểm tra thành công nếu có thông báo hoặc redirect
    cy.contains('Đặt hàng thành công').should('exist').wait(2000)
  });

  it('Chọn sản phẩm và mua ngay với phương thức thanh toán qua ngân hàng', () => {
    cy.visit('/product-type/ghe-an');
    cy.contains('Ghế Ăn Gỗ Cao Su Tự Nhiên MOHO VLINE 601').click();
    cy.contains('Mua Ngay').click();

    cy.url().should('include', '/checkout');

    cy.get('input[name="fullname"]').type('Nguyễn Thị Bích Ngân');
    cy.get('input[name="phone"]').type('0905569875');

    cy.get('input').eq(4).type('Hồ Chí Minh');
    cy.contains('li', 'Hồ Chí Minh').click();

    cy.get('input').eq(5).type('Quận 12');
    cy.contains('li', 'Quận 12').click();

    cy.get('input').eq(6).type('Đông Hưng Thuận');
    cy.contains('li', 'Đông Hưng Thuận').click();

    cy.get('input').eq(7).type('Nguyễn Văn Quá');
    cy.get('input').eq(8).type('11');
    cy.contains('Chuyển Khoản Ngân Hàng').click();
    cy.contains('Xác Nhận Mua Hàng').click();

    // Chờ modal xuất hiện
    cy.wait(1000);
    cy.get('.modal-footer button').eq(1).click({ force: true });

  });
});



