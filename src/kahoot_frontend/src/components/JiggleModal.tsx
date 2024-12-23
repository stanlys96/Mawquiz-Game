import { motion } from "framer-motion";
import { ReactElement } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  outerDivClassName: string;
  innerDivClassName: string;
  children: ReactElement;
}

const jiggleAnimate = {
  opacity: 1,
  scale: 1,
  rotate: [0, -5, 5, -3, 3, 0],
  x: [0, -10, 10, -5, 5, 0],
};

export const JiggleModal = ({
  isOpen,
  onClose,
  outerDivClassName,
  innerDivClassName,
  children,
}: Props) => {
  return (
    isOpen && (
      <div className={outerDivClassName} onClick={onClose}>
        <motion.div
          className={innerDivClassName}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 1, scale: 1 }}
          animate={jiggleAnimate}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      </div>
    )
  );
};
