const ProductService = require('../service/ProductService')
const UploadFileHelper = require('../helper/uploadFile.helper')
const { toSlug } = require('../common/utils/slug')
const { paginateArray } = require('../common/utils/pagination')
const path = require('path')
const fs = require('fs')

const createProduct = async (req, res) => {
    try {
        const { name, type, price, countInStock, description, descriptionDetail, discount, productCode, isBestSeller, origin, material, size, warranty } = req.body;

        if (!name || !type || !price || !countInStock) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Không có file nào được tải lên" });
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Loại file không được hỗ trợ." });
        }

        const imagePath = path.resolve(req.file.path);

        let driveRes = null;
        try {
            driveRes = await UploadFileHelper.uploadFile(imagePath, {
                imgName: req.file.originalname,
                shared: true
            });
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ message: 'Không thể tải ảnh lên Google Drive' });
        }

        const imageUrl = driveRes ? driveRes.webContentLink : null;
        if (!imageUrl) {
            return res.status(500).json({ message: 'Lỗi lấy link ảnh từ Google Drive' });
        }

        fs.unlinkSync(imagePath); 

        const newProduct = {
            name,
            image: imageUrl,
            type,
            price,
            countInStock,
            description,
            descriptionDetail,
            discount,
            productCode,
            isBestSeller,
            origin,
            material,
            size,
            warranty
        };

        const response = await ProductService.createProduct(newProduct);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message || 'Đã có lỗi xảy ra khi tạo sản phẩm'
        });
    }
};


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

        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ message: "Loại file không được hỗ trợ. Chỉ hỗ trợ JPEG, PNG và GIF." });
            }
            const imagePath = path.resolve(req.file.path);
            const driveRes = await UploadFileHelper.uploadFile(imagePath, {
                imgName: req.file.originalname,
                shared: true
            });


            data.image = driveRes.webContentLink || null;

            fs.unlinkSync(imagePath);
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

const getRating = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log(productId)
        const rating = await ProductService.getRating(productId);
        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
    getProductByType,
    searchProduct,
    getSuggestions,
    getRating
};