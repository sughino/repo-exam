import { useContext, useState } from 'react';
import { SmallButton, RegularButton, BigButton } from '../Text';
import { ThemeContext } from 'styled-components';
import { Icon } from '../Icon';
import './buttons.css';

const baseIcon = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const baseStyle = {
    ...baseIcon,
    border: 0,
    borderRadius: 10,
    cursor: 'pointer',
    position: 'relative',
    gap: 8
};

const sizeMap = {
    big: (onlyicon) => ({
        style: {
            height: 56,
            paddingInline: onlyicon ? 0 : 37.3333333334,
            width: onlyicon ? 56 : 'fit-content'
        },
        TextComponent: BigButton,
        icon: 25
    }),
    regular: (onlyicon) => ({
        style: {
            height: 48,
            paddingInline: onlyicon ? 0 : 32,
            width: onlyicon ? 48 : 'fit-content'
        },
        TextComponent: RegularButton,
        icon: 18
    }),
    small: (onlyicon) => ({
        style: {
            height: 36,
            paddingInline: onlyicon ? 0 : 24,
            width: onlyicon ? 36 : 'fit-content'
        },
        TextComponent: SmallButton,
        icon: 15
    })
};

const variantStyles = {
    primary: (theme, isHovered) => ({
        ...baseStyle,
        backgroundColor: isHovered ? theme.colors.primaryHover : theme.colors.primary,
        color: theme.colors.white,
        border: 'solid 2px',
        borderColor: theme.colors.black10
    }),
    secondary: (theme, isHovered) => ({
        ...baseStyle,
        backgroundColor: isHovered ? theme.colors.white80 : theme.colors.white,
        color: theme.colors.black,
        border: 'solid 2px',
        borderColor: theme.colors.white
    }),
    accent: (theme, isHovered) => ({
        ...baseStyle,
        backgroundColor: isHovered ? theme.colors.white20 : 'transparent',
        color: theme.colors.white,
        border: 'solid 2px',
        borderColor: theme.colors.white
    }),
    warning: (theme, isHovered) => ({
        ...baseStyle,
        backgroundColor: isHovered ? theme.colors.warningHover : theme.colors.warning,
        color: theme.colors.white,
        border: 'solid 2px',
        borderColor: theme.colors.black10
    }),
    secondaryWarning: (theme, isHovered) => ({
        ...baseStyle,
        backgroundColor: isHovered ? theme.colors.warning10 : 'transparent',
        color: theme.colors.warning,
        border: 'solid 2px',
        borderColor: theme.colors.warning
    })
};

export const Button = ({
    children,
    icon = 'none',
    onlyicon = false,
    iconName,
    size,
    variant = 'primary',
    onClick,
    style,
    type,
    noBorder = false,
    disabled = false
}) => {
    const theme = useContext(ThemeContext);
    const [isHovered, setIsHovered] = useState(false);

    const sizeConfig = (sizeMap[size] || sizeMap.regular)(onlyicon);
    const { style: sizeStyle, TextComponent, icon: iconSize } = sizeConfig;
    const variantStyle = variantStyles[variant] || variantStyles.primary;

    const variantStyleWithColor = variantStyle(theme, isHovered);
    
    const combinedStyle = noBorder 
    ? {
        ...baseStyle,
        ...sizeStyle,
        color: theme.colors.white,
        backgroundColor: 'transparent'
    }
    : {
        ...variantStyleWithColor,
        ...sizeStyle
    };
    const iconColor = variantStyleWithColor.color;

    return (
        <button
            style={{ ...combinedStyle, ...style, ...(disabled && { opacity: 0.3 }) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            type={type || 'button'}
        >
            <div className="button-feedback-wrapper">
                {onlyicon ? (
                    <div style={baseIcon}>
                        <Icon name={iconName} size={iconSize} color={iconColor} />
                    </div>
                ) : (
                    <>
                        {icon === 'start' && (
                            <div style={baseIcon}>
                                <Icon name={iconName} size={iconSize} color={iconColor} />
                            </div>
                        )}
                        <TextComponent>{children}</TextComponent>
                        {icon === 'end' && (
                            <div style={baseIcon}>
                                <Icon name={iconName} size={iconSize} color={iconColor} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </button>
    );
};