import initStateRedux from './initData'


function reducer(state = initStateRedux, action) {
    console.log('State::::', state)
    switch(action.type) {
        case 'shopData':
            console.log('shopData::::', action)
            return {
                ...state,
                shopData: action.shopData
            }
        case 'userName':
            console.log('userName::::', action)
            return {
                ...state,
                userName: action.userName
            }
        case 'address':
            console.log('address::::', action)
            return {
                ...state,
                address: action.address
            }
        default:
            return state;    
    }
}

export default reducer