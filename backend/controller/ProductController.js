const ProductService = require('../service/ProductService')
const { toSlug } = require('../common/utils/slug')
const { paginateArray } = require('../common/utils/pagination')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, description, descriptionDetail, discount, productCode, isBestSeller, origin, material, size, warranty} = req.body

        if (!name || !image || !type || !price || !countInStock) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const response = await ProductService.getAllProduct()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getProductByType = async (req, res) => {
    try {
        const { slug, limit, page } = req.query;
        if (!slug || !limit) throw Error("Missing params");
        const products = await ProductService.getAllProductWithoutFilter();
        if (!products || !Array.isArray(products)) throw Error("No data");

        const productFilter = products.filter(p => toSlug(p.type) === slug);
        const paging = paginateArray(productFilter, page + 1, limit);

        return res.status(200).json({
            status: 'OK',
            message: 'success',
            data: paging.data,
            total: paging.total,
            pageCurrent: paging.page,
            totalPage: paging.totalPages,
        })

    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const searchProduct = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ status: 'ERR', message: 'Missing search query' });
        }

        const products = await ProductService.searchProduct(query);
        return res.status(200).json({
            status: 'OK',
            message: 'Search successful',
            data: products
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const getSuggestions = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ status: 'ERR', message: 'Missing query' });

        const suggestions = await ProductService.getSuggestions(query);
        res.status(200).json({ status: 'OK', data: suggestions });
    } catch (error) {
        console.error('Lỗi khi lấy gợi ý:', error);
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
    getProductByType,
    searchProduct,
    getSuggestions
};