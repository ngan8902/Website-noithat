describe('Chức năng tạo nhân viên mới', () => {
    before(() => {
        cy.loginByApiForStaff();
    })

    it('Thêm tài khoản nhân viên mới', () => {
        cy.visit('/admin/employee')

        cy.contains('Thêm Nhân Viên').click()

        cy.get('input').eq(2).type('Nguyễn Văn C')
        cy.get('input').eq(3).type('user4')
        cy.get('input').eq(4).type('111')
        cy.get('input').eq(5).type('vanc@gmail.com')
        cy.get('input').eq(6).type('0987654321')
        cy.get('input[type="date"]').type('1999-05-01');


        cy.get('select.form-select').select('Nam');
        cy.get('input').eq(8).type('19 ĐHT')

        cy.get('.modal button').eq(2).click({ force: true });
    })
});