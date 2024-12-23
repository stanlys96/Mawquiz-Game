import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
import { modalVariants } from "../helper/helper";

interface Props {
  isOpenModal: boolean;
  handleClose: () => void;
  outerDivClassName?: string;
  innerDivClassName?: string;
  handleDragLeave?: () => void;
  handleDragOver?: (e: any) => void;
  handleDrop?: (e: any) => void;
  children?: ReactElement;
}

export const BouncyModal = ({
  isOpenModal,
  handleClose,
  outerDivClassName,
  innerDivClassName,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  children,
}: Props) => {
  return (
    <AnimatePresence>
      {isOpenModal && (
        <div onClick={handleClose} className={outerDivClassName}>
          <motion.div
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={(e) => e.stopPropagation()}
            className={innerDivClassName}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
