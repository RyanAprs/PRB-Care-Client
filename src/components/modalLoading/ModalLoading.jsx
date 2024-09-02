import { ProgressSpinner } from 'primereact/progressspinner';

const ModalLoading = ({className=""}) => {
    return (
        <div
            className={`flex item-center justify-center  p-dialog-mask p-dialog-center p-component-overlay p-component-overlay-enter ${className}`}
            data-pc-section="mask"
            style={{ height: '100%', width: '100%', left: 0, top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}
        >
            <ProgressSpinner/>
        </div>
    );
}

export default ModalLoading;
