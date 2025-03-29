

export function SchemaValidator(schema) {
    return async (req, res, next) => {
        console.log(req.body);
        
        const result = await schema.safeParse(req.body);
        if(!result.success) {
            console.log(result.error);
            
            const formattedErrors = Object.entries(result.error.format())
            .filter(([key]) => key !== "_errors")
            .map(([field, error]) => ({
                field,
                message: `Invalid ${field} input.`,
                error
            }));
            
            res.status(400).json({
                success: false,
                message: formattedErrors[0].message,
            });

            return;

        }
        req.body = result.data;
        next()
    }
}