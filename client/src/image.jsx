export const Image = ({ file = "" }) => {
  return (
    <div>
      <img src={`/image/${file}`} />
    </div>
  );
};
