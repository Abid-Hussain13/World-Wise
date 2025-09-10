import Flag from "react-world-flags";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <Flag code={country.emoji} height={25} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
