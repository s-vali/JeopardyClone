type Props = {
  title: string;
};

export default function CategoryHeader({ title }: Props) {
  return (
    <div className="bg-blue-700 text-white font-bold text-center p-4 border border-blue-600">
      {title.toUpperCase()}
    </div>
  );
}
