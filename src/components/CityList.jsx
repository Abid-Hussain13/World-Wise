import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../Contexts/CitiesContext";

export default function CityList() {
  const { cities, isLoading, error } = useCities();
  if (isLoading) return <Spinner />;

  if (error) return <Message message={error} />;

  if (!cities.length && !error)
    return (
      <Message
        message={"Add your first City by clicking on the city on the map."}
      />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
