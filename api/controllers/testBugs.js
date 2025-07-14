// Dans api/controllers/testBugs.js
export const testBugs = () => {
    // 🐛 Variable non utilisée
    const unusedVariable = "Je sers à rien";

    // 🐛 Condition toujours vraie
    if (true) {
        console.log("Always true");
    }

    // 🐛 Code dupliqué
    function duplicate1() {
        const a = 1;
        const b = 2;
        return a + b;
    }

    function duplicate2() {
        const a = 1;
        const b = 2;
        return a + b;
    }

    // 🐛 Fonction trop complexe
    function complexFunction(x) {
        if (x > 0) {
            if (x > 10) {
                if (x > 100) {
                    if (x > 1000) {
                        return "huge";
                    }
                    return "big";
                }
                return "medium";
            }
            return "small";
        }
        return "negative";
    }

    // 🐛 Égalité faible (== au lieu de ===)
    if (1 == "1") {
        console.log("Bad comparison");
    }
}