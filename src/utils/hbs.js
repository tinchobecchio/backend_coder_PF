import { create } from 'express-handlebars';

export const hbs = create({
    helpers: {
        roleClass() {
            switch (this.role) {
                case "user":
                    return "badge text-bg-secondary"
                    break;
                case "premium":
                    return "badge text-bg-warning"
                    break;
                case "admin":
                    return "badge text-bg-dark"
                    break;
            
                default:
                    break;
            }
        }
    }
});