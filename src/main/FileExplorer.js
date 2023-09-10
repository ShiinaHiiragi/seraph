import { useParams } from "react-router";

const FileExplorer = () => {
  const { folderName } = useParams();

  return (
    <div>
      folderName: {folderName}
    </div>
  )
}

export default FileExplorer;
