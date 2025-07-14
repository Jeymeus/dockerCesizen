// Dans frontend/src/utils/testBugs.js
export const testVueBugs = () => {
    // 🐛 Console.log oublié
    console.log("Debug message oublié");

    // 🐛 Variable globale
    window.globalVar = "Bad practice";

    // 🐛 Try-catch vide
    try {
        dangerousFunction();
    } catch (e) {
        // Catch vide = mauvaise pratique
    }

    // 🐛 Fonction récursive sans condition d'arrêt
    function infiniteRecursion() {
        return infiniteRecursion();
    }

    // 🐛 Regex complexe non commentée
    const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")$/;
};