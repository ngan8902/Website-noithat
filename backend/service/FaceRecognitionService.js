const calculateCosineSimilarity = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2 || !Array.isArray(embedding1) || !Array.isArray(embedding2) || embedding1.length !== embedding2.length) {
        console.error("Lỗi: Embedding không hợp lệ.");
        return -1; 
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        normA += Math.pow(embedding1[i], 2);
        normB += Math.pow(embedding2[i], 2);
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return -1; 
    }

    return dotProduct / (normA * normB);
};
module.exports = {
    calculateCosineSimilarity
};
