export const Column = ({ children, width, textColor, backgroundColor }) => {
    const textColorStyle = textColor ? { color: textColor } : {};
    const backgroundColorStyle = backgroundColor ? { backgroundColor } : {};
    const widthStyle = width
      ? { minWidth: width, flexGrow: 1 }
      : { flexGrow: 1, flexBasis: 0 }; // objasnjeno u lek 27
    return (
      <div
        style={{ ...widthStyle, ...textColorStyle, ...backgroundColorStyle }}
        // style={widthStyle}
        className="px-2 py-5"
      >
        {children}
      </div>
    );
  };