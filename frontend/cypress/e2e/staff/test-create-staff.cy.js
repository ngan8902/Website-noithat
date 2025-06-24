describe('Chức năng tạo nhân viên mới', () => {
    beforeEach(() => {
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

    it('Tạo tài khoản nhân viên nhưng nhập thiếu tên nhân viên', () => {
        cy.visit('/admin/employee')

        cy.contains('Thêm Nhân Viên').click()

        cy.get('input').eq(3).type('user5')
        cy.get('input').eq(4).type('111')
        cy.get('input').eq(5).type('vana@gmail.com')
        cy.get('input').eq(6).type('0987654321')
        cy.get('input[type="date"]').type('1999-05-01')


        cy.get('select.form-select').select('Nam');
        cy.get('input').eq(8).type('19 ĐHT')

        cy.get('.modal button').eq(2).click({ force: true })

        cy.contains('Vui lòng điền đầy đủ thông tin!').wait(3000)
    })

    it('Sửa thông tin nhân viên', () => {
        cy.visit('/admin/employee')

        cy.contains('Sửa').click()

        cy.get('input[type="date"]').type('2000-05-01')

        cy.get('.modal button').eq(1).click({ force: true }).wait(2000)

    })
});