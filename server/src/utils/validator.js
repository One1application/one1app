

export function SchemaValidator(schema) {
    return async (req, res, next) => {
        console.log(req.body);
        
        const result = await schema.safeParse(req.body);
        if(!result.success) {
            const formattedErrors = Object.entries(result.error.format())
            .filter(([key]) => key !== "_errors")
            .map(([field, error]) => ({
                field,
                message: Array.isArray(error) ? error.join(", ") : (error)._errors?.join(", ") || "Invalid input"
            }));
            res.status(400).json({
                success: false,
                message: "Invalid inputs.",
                errors: formattedErrors
            });

            return;

        }
        req.body = result.data;
        next()
    }
}