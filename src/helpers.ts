export const helpers = {
    isAdmin: function(role: string) {
        return role && role.toLowerCase() === "admin";
    },

    isModerator: function(role: string) {
        return role && (role.toLowerCase() === "moderator" || role.toLowerCase() === "admin");
    },

    getRole: function(role: string) {
        switch (role.toLowerCase()) {
            case "admin": return "Админ";
            case "moderator": return "Модератор";
            case "guest": return "Гость";
        }
    },

    getPortionsForm: function(portions) {
        const ones = portions % 10;
        const tens = (portions - ones) / 10;

        if (ones === 1 && tens !== 1) {
            return "порция";
        } else if ([2, 3, 4].includes(ones) && tens !== 1) {
            return "порции";
        } else {
            return "порций";
        }
    },

    isApproved: function(state: string) {
        return state.toLowerCase() === "approved";
    },

    isSnacks: function(category: string) {
        return category && category.toLowerCase() === "snacks";
    },

    isSalads: function(category: string) {
        return category && category.toLowerCase() === "salads";
    },

    isSoups: function(category: string) {
        return category && category.toLowerCase() === "soups";
    },

    isFish: function(category: string) {
        return category && category.toLowerCase() === "fish";
    },

    isMeat: function(category: string) {
        return category && category.toLowerCase() === "meat";
    },

    isGarnish: function(category: string) {
        return category && category.toLowerCase() === "garnish";
    },

    isDesserts: function(category: string) {
        return category && category.toLowerCase() === "desserts";
    },

    isDrinks: function(category: string) {
        return category && category.toLowerCase() === "drinks";
    },

    isKids: function(category: string) {
        return category && category.toLowerCase() === "kids";
    },

    getCategory: function(category: string) {
        switch (category.toLowerCase()) {
            case "snacks": return "Закуски";
            case "salads": return "Салаты";
            case "soups": return "Супы";
            case "fish": return "Рыбные блюда";
            case "meat": return "Мясные блюда";
            case "garnish": return "Гарниры";
            case "desserts": return "Десерты";
            case "drinks": return "Напитки";
            case "kids": return "Детское меню";
        };
    },

    getMeasurement: function(measurement: string) {
        switch (measurement.toLowerCase()) {
            case "g": {
                return "г";
            }
            case "kg": {
                return "кг";
            }
            case "l": {
                return "л";
            }
            case "ml": {
                return "мл";
            }
            case "teas": {
                return "ч. л.";
            }
            case "tables": {
                return "ст. л.";
            }
            case "piece": {
                return "шт";
            }
            case "glass": {
                return "стак.";
            }
        };
    },

    reverseSlashes: function(path: string) {
        return path.replaceAll('\\', '/');
    },
}