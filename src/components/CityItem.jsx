import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../Contexts/CitiesContext";
import Flag from "react-world-flags";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
export default function CityItem({ city }) {
  const { currentCity, deleteCity, isLoading } = useCities();
  const { cityName, date, emoji, id, position } = city;

  async function handleDeletingCity(e) {
    e.preventDefault();

    await deleteCity(id, position);
  }

  if (isLoading) return <Spinner />;

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id == currentCity.id && styles["cityItem--active"]
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>
          <Flag code={emoji} height={16} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button onClick={handleDeletingCity} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}
