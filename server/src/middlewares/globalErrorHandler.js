export default (err, _, res, __) => {
    console.log("[Global Error Handle] : ", err);

    res.status(err?.statusCode || 500).json(err);
};
