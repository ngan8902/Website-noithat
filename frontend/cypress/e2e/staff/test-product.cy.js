const fileName = 'test-picture.jpg';

describe('Chức năng quản lý đươn hàng', () => {
    beforeEach(() => {
        cy.loginByApiForStaff()
    })

    it('Tạo sản phẩm', () => {
        cy.visit('/admin/dashboard')

        cy.contains('Thêm Sản Phẩm').click()

        cy.get('input[type="file"]').attachFile(fileName)
        cy.get('input').eq(2).type('Bàn ăn')
        cy.get('select.form-select').select('Bàn Sofa')
        cy.get('input').eq(3).type('Việt Nam')
        cy.get('input').eq(4).type('Gỗ')
        cy.get('input').eq(5).type('D100 x R50 x C30')
        cy.get('input').eq(6).type('12 tháng')
        cy.get('input').eq(7).type('5500000')
        cy.get('input').eq(8).type('10')

        cy.get('.modal button').eq(1).click({ force: true });
    })
})