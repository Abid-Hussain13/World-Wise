import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPositions } from "../hooks/useUrlPositions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";
import Spinner from "./Spinner";
import Flag from "react-world-flags";
import { useCities } from "../Contexts/CitiesContext";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";
function Form() {
  const [lat, lng] = useUrlPositions();
  const { addCity, isLoading } = useCities();
  const nevigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [gettingPositionError, setGettingPositionError] = useState("");
  const [positionLoading, setPositionLoading] = useState(false);

  useEffect(
    function () {
      if (!lng && !lat) return;
      async function getPositionDetails() {
        try {
          setPositionLoading(true);
          setGettingPositionError("");
          setDate(new Date());
          const res = await fetch(
            `${BASE_URL}latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (data.city === "")
            throw new Error(
              "That does not seems to be City Click somewhere else 😅"
            );
          setCityName(data.city);
          setCountry(data.countryName);
          setCountryCode(data.countryCode);
        } catch (err) {
          setGettingPositionError(err.message);
        } finally {
          setPositionLoading(false);
        }
      }
      getPositionDetails();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji: countryCode,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await addCity(newCity);
    nevigate("/app/cities");
  }

  if (!lat && !lng) return <Message message={"Click on City to get Started"} />;
  if (positionLoading) return <Spinner />;
  if (gettingPositionError) return <Message message={gettingPositionError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <Flag code={countryCode} height={16} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          value={date}
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack type="back">&larr; Back</ButtonBack>
      </div>
    </form>
  );
}

export default Form;
