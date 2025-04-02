const Product = require("../model/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                name: newProduct.name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }

            const lastProduct = await Product.findOne().sort({ createdAt: -1 });
            let newCode = 'SP1000';
            if (lastProduct && lastProduct.productCode) {
                const lastCodeNumber = parseInt(lastProduct.productCode.match(/\d+/)) || 1000;
                newCode = `SP${lastCodeNumber + 1}`;
            }


            const createdProduct = await Product.create({
                ...newProduct,
                productCode: newCode
            });

            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'success',
                data: allProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'success',
                data: product
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProductWithoutFilter = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find();
            resolve(allProduct);
        } catch (e) {
            reject(e)
        }
    })
}

const removeAccents = (str) => {
    return str
        .toLowerCase()
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

const searchProduct = async (query) => {
    try {
        if (!query) {
            return [];
        }

        const formattedQuery = removeAccents(query).trim();
        const regex = new RegExp(`^${formattedQuery}`, 'i');

        const products = await Product.find().lean();

        const filteredProducts = products.filter(product =>
            removeAccents(product.name).match(regex)
        );

        return filteredProducts;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getSuggestions = async (query) => {
    try {
        if (!query) return [];

        const formattedQuery = removeAccents(query).trim();
        const regex = new RegExp(`^${formattedQuery}`, "i");

        return await Product.find({ name: { $regex: regex } })
            .limit(5)
            .lean();
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
    getAllProductWithoutFilter,
    searchProduct,
    getSuggestions
}