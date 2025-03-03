const Product = require("../model/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, description, descriptionDetail, isBestSeller, discount, productCode, origin, material, size, warranty} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }

            const lastProduct = await Product.findOne().sort({ createdAt: -1 });

            // Tạo productCode tự động
            let newCode = 'SP1000';
            if (lastProduct && lastProduct.productCode) {
                // Tách phần số khỏi productCode bằng RegEx
                const lastCodeNumber = parseInt(lastProduct.productCode.match(/\d+/)) || 1000;
                newCode = `SP${lastCodeNumber + 1}`;
            }


            const createdProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                description,
                descriptionDetail,
                isBestSeller,
                discount,
                origin,
                material,
                size,
                warranty,
                ...newProduct,
                productCode: newCode
            })
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

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments() //tổng số sản phẩm
            const whereCondition = filter
            if (filter) {
                whereCondition = {
                    name: { $regex: filter, $options: 'i' } // Tìm kiếm không phân biệt hoa thường
                };
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),
                    whereCondition: whereCondition
                })
            }
            // if (sort) {
            //     const objectSort = {}
            //     objectSort[sort[1]] = sort[0]
            //     const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
            //     resolve({
            //         status: 'OK',
            //         message: 'success',
            //         data: allProductSort,
            //         total: totalProduct,
            //         pageCurrent: Number(page + 1),
            //         totalPage: Math.ceil(totalProduct / limit)
            //     })
            // }
            const allProduct = await Product.find().limit(limit).skip(page * limit) // Phân sản phẩm theo trang (8 sp 1 trang)
            resolve({
                status: 'OK',
                message: 'success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
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

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
    getAllProductWithoutFilter
}