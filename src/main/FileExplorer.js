import RouteField from "../interface/RouteField";
import { useParams } from "react-router";

const FileExplorer = () => {
  const { folderName } = useParams();

  return (
    <RouteField>
      FILENAME: {folderName}
    </RouteField>
  )
}

export default FileExplorer;
