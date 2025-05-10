import styles from './CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import CountryItem from './CountryItem';
function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message=" 👋 Add your first city by clicking on a city on the map" />
    );

  // `countries` is a new array built by reducing over the `cities` array
  const countries = cities.reduce((arr, city) => {
    // First, we check if the current city's country is already in the `arr`
    if (!arr.map((el) => el.country).includes(city.country)) {
      // If the country is not yet in the accumulator array, add it
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      // If the country is already present, skip it (return current array as-is)
      return arr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
