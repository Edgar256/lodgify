import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
// import status constants
import { AVAILABLE, UNAVAILABLE, BOOKED } from "./utils/status";
// import API URL
import { apiURL } from "./utils/apiURL";
import { titleCase } from "./utils/helper";

function App() {
	// const apiURL = "";
	const [houses, setHouses] = useState([]);
	const [allHouses, setAllHouses] = useState([]);
	const [status, setStatus] = useState("");
	const [count, setCount] = useState(0);

	useEffect(() => {
		axios
			.get(`${apiURL}`)
			.then((res) => {
				// store all houses
				setAllHouses(res.data);

				// default show bookable empty houses
				const availableHouses = res.data.filter((elem) => {
					if (elem.bookable && elem.booked < 1) {
						return true;
					} else {
						return false;
					}
				});
				availableHouses.map((elem) => (elem.status = AVAILABLE));
        setStatus(AVAILABLE);
        setCount(availableHouses.length)
				setHouses(availableHouses);
			})
			.catch((error) => {
				return error;
			});
	}, []);

	// view available houses
	const viewAvailableHouses = () => {
		const availableHouses = allHouses.filter((elem) => {
			if (elem.bookable && elem.booked < 1) {
				return true;
			} else {
				return false;
			}
		});
		availableHouses.map((elem) => (elem.status = AVAILABLE));
    setStatus(AVAILABLE);
    setCount(availableHouses.length)
		setHouses(availableHouses);
	};

	// view booked houses
	const viewBookedHouses = () => {
		const bookedHouses = allHouses.filter((elem) => elem.booked > 0);
		bookedHouses.map((elem) => (elem.status = BOOKED));
    setStatus(BOOKED);
    setCount(bookedHouses.length)
		setHouses(bookedHouses);
	};

	// view unavailable houses
	const viewUnavailableHouses = () => {
		const unavailableHouses = allHouses.filter((elem) => {
			if (!elem.bookable || elem.booked > 0) {
				return true;
			} else {
				return false;
			}
		});
		unavailableHouses.map((elem) => (elem.status = UNAVAILABLE));
    setStatus(UNAVAILABLE);
		setCount(unavailableHouses.length);
		setHouses(unavailableHouses);
	};

	return (
		<div className="bg-light">
			<div className="container mb-3 pt-5 d-flex">
				<h4>{titleCase(status)} houses</h4>
				<span className="text-muted py-1 ml-2">
					<i>Showing {count} results</i>
				</span>
			</div>
			<div className="container my-3">
				<button
					className="btn btn-success mr-2 py-1 rounded-custom"
					onClick={viewAvailableHouses}
				>
					Available
				</button>
				<button
					className="btn btn-primary mr-2 py-1 rounded-custom"
					onClick={viewBookedHouses}
				>
					Booked
				</button>
				<button
					className="btn btn-danger mr-2 py-1 rounded-custom"
					onClick={viewUnavailableHouses}
				>
					Unavailable
				</button>
			</div>
			<div className="container d-flex flex-wrap">
				{houses.length < 1 ? (
					<span>No Data to show</span>
				) : (
					houses.map((house, id) => {
						return (
							<div className="house-card p-2 rounded" key={id}>
								<div className="card shadow">
									<div className="d-block position-relative">
										{house.status === "available" ? (
											<div className="btn btn-success position-absolute m-2 py-1 rounded-custom">
												{house.status}
											</div>
										) : house.status === "booked" ? (
											<div className="btn btn-primary position-absolute m-2 py-1 rounded-custom">
												{house.status}
											</div>
										) : (
											<div className="btn btn-danger position-absolute m-2 py-1 rounded-custom">
												{house.status}
											</div>
										)}
										<img
											src={house.image}
											className="w-100 rounded"
											alt="house"
										/>
									</div>
									<div className="p-3">
										<div className="my-1 text-muted">id: {house.id}</div>
										<div className="my-1">
											<strong>
												<i>{house.name}</i>
											</strong>
										</div>
										{house.status === "available" ? (
											<button className="btn btn-primary w-100">Book</button>
										) : house.booked > 0 ? (
											<p className="text-success">
												Booked for {house.booked} days
											</p>
										) : (
											<button className="btn btn-secondary w-100" disabled>
												Not Bookable
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default App;
