interface Props {
  loading: boolean;
  description: string;
}

export const LoadingLayover = ({ loading, description }: Props) => {
  return (
    loading && (
      <div className="relative kahoot-container">
        <div className="kahoot-spinner">
          <div />
          <div />
          <div />
          <div />
        </div>
        <p className="montserrat medium text-[28px] leading-[0px]">
          {description}
        </p>
      </div>
    )
  );
};
