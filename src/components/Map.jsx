import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
export default function Map() {
  const nevigate = useNavigate();

  const [searchParam, setSearchParam] = useSearchParams();
  const lat = searchParam.get("lat");
  const lng = searchParam.get("lng");

  return (
    <div className={styles.mapContainer} onClick={() => nevigate("form")}>
      <h1>Map</h1>
      <h2>
        Positon:{lat}, {lng}
      </h2>
      <button
        onClick={() => {
          setSearchParam({ lat: 23, lng: 123 });
        }}
      >
        Change
      </button>
    </div>
  );
}
