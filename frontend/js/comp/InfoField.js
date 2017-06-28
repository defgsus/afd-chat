import React from 'react'
import PropTypes from 'prop-types'

const InfoField = ({ className, onClick, selected, values, clickValue }) => {
    var cls = "info-field";
    if (className)
        cls += " "+className;
    if (selected) {
        cls += " info-field-selected ";
        if (className)
            cls += " "+className+"-selected";
    }
    if (onClick)
        cls += " clickable";
    return (
        <div
            className={cls}
            onClick={(e) => { if (onClick) { e.preventDefault(); e.stopPropagation(); onClick(clickValue); }}}
        >
            {values.map((v, i) => (
                <div key={i} className="info-field-item">{v}</div>
            ))}
        </div>
    );
}

InfoField.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    values: PropTypes.array.isRequired,
    clickValue: PropTypes.any
};

export default InfoField;