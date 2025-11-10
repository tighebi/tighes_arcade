// Skin configurations
const Skins = {
    createSkin(type, currentTheme) {
        switch(type) {
            case 'classic':
                return {
                    getHeadColor: (frame) => THEMES[currentTheme].headColor,
                    getHeadBorderColor: (frame) => HEAD_BORDER_COLORS[currentTheme] || HEAD_BORDER_COLORS.default,
                    getBodyColor: (frame, index) => THEMES[currentTheme].bodyColor
                };
            case 'rainbow':
                return {
                    getHeadColor: (frame) => {
                        const hue = (frame * 2) % 360;
                        return `hsl(${hue}, 70%, 60%)`;
                    },
                    getHeadBorderColor: (frame) => {
                        const hue = (frame * 2 + 30) % 360;
                        return `hsl(${hue}, 90%, 70%)`;
                    },
                    getBodyColor: (frame, index) => {
                        const hue = (frame * 2 + index * 30) % 360;
                        return `hsl(${hue}, 70%, 50%)`;
                    }
                };
            case 'robot':
                return {
                    getHeadColor: (frame) => '#e0e0e0',
                    getHeadBorderColor: (frame) => '#ffffff',
                    getBodyColor: (frame, index) => {
                        return index % 2 === 0 ? '#808080' : '#a0a0a0';
                    }
                };
            default:
                return this.createSkin('classic', currentTheme);
        }
    }
};

