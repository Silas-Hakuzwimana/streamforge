export default function MediaHistory({ mediaList }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {mediaList.map(media => (
        <div key={media._id} className="p-4 bg-white rounded shadow">
          <p className="font-bold">{media.fileName}</p>
          <p className="text-sm text-gray-500">{media.source} | {media.type}</p>
          {media.type === 'image' ? (
            <img src={media.cloudUrl} alt={media.fileName} className="mt-2 w-full h-48 object-cover rounded" />
          ) : (
            <a href={media.cloudUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 mt-2 block">
              Open {media.type}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
