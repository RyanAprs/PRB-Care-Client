import { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";

const CustomDropdown = ({
                            value,
                            options,
                            onChange,
                            placeholder,
                            optionLabel,
                            itemTemplate,
                            valueTemplate,
                            className,
                        }) => {
    const [currentWidth, setCurrentWidth] = useState();
    const ref = useRef();

    useEffect(() => {
        const element = ref.current.getElement();
        setCurrentWidth(element.clientWidth);
    }, [ref]);

    return (
        <Dropdown
            value={value}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            optionLabel={optionLabel}
            itemTemplate={itemTemplate}
            valueTemplate={valueTemplate}
            filter
            className={className ? className : "w-full p-2 text-sm"}
            ref={ref}
            pt={{
                panel: {
                    style: {
                        ...(currentWidth ? { width: currentWidth } : {}),
                    },
                },
            }}
        />
    );
};

export default CustomDropdown;
