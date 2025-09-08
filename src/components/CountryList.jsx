import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";

export default function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message={"Add Cities first"} />;

  //extracting countries from cities without duplication

  //   const countries = cities.reduce((arr, city) => {
  //     if (!arr.map((el) => el.country).includes(city.country))
  //       return [...arr, { country: city.country, emoji: city.emoji }];
  //     else return arr;
  //   }, []);

  const countries = [];
  const seen = new Set();

  cities.forEach((city) => {
    if (!seen.has(city.country)) {
      seen.add(city.country);
      countries.push({
        country: city.country,
        emoji: city.emoji,
      });
    }
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
