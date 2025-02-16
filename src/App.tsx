import React, { useState, useEffect } from "react";
import { BartStation } from "./Stations";
import "./App.css";

type ETD = {
  length: string;
  minutes: string;
};

type BartLineETD = {
  abbreviation: string;
  destination: string;
  estimate: Array<ETD>;
};

type BartStationETD = {
  root: {
    station: Array<{
      abbr: string;
      etd: Array<BartLineETD>;
    }>;
  };
};

// class AppClassStyle extends React.Component {
//   state: { estimates: Array<number> } = { estimates: [] };
//   componentDidMount() {
//     allEstimatesForEveryTrain("woak", "s").then(
//       (allEstimates: Array<number>) => {
//         this.setState({ estimates: allEstimates });
//       }
//     );
//   }

//   shouldComponentUpdate(prevProps) {
//     if (prevProps.foo != this.props.foo) {
//       //... do something
//     }
//   }

//   render() {
//     console.log("Time estimates are", this.state.estimates);

//     const formattedTimeEstimates = this.state.estimates
//       .map((time: number) => `${time} minutes`)
//       .map((formattedString: string) => {
//         return <div>{formattedString}</div>;
//       });

//     return (
//       <div className="App">
//         <header className="App-header">
//           <p>Your next Bart train is leaving in </p>
//           {formattedTimeEstimates}
//         </header>
//       </div>
//     );
//   }
// }

const App: React.FC = () => {
  const [timeEstimates, setTimeEstimates] = useState<Array<number>>([]);
  useEffect(() => {
    allEstimatesForEveryTrain("woak", "s").then(
      (allEstimates: Array<number>) => {
        setTimeEstimates(allEstimates);
      }
    );
  }, []);
  console.log("Time estimates are", timeEstimates);

  const formattedTimeEstimates = timeEstimates
    .map((time: number) => `${time} minutes`)
    .map((formattedString: string) => {
      return <div>{formattedString}</div>;
    });

  return (
    <div className="App">
      <header className="App-header">
        <p>Your next Bart train is leaving in </p>
        {formattedTimeEstimates}
      </header>
    </div>
  );
};

// http://api.bart.gov/api/etd.aspx?cmd=etd&dir=n&orig=WOAK&key=MW9S-E7SL-26DU-VV8V&json=y

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
const allEstimatesForEveryTrain = (
  station: BartStation,
  direction: "s" | "n"
): Promise<Array<number>> => {
  console.log(`You want to leave from ${station} going ${direction}`);
  const bartPromise: Promise<Response> = fetch(
    `https://api.bart.gov/api/etd.aspx?cmd=etd&dir=${direction}&orig=${station}&key=MW9S-E7SL-26DU-VV8V&json=y`
  );
  console.log(bartPromise);

  const estimates = bartPromise
    .then((resp: Response) => {
      if (resp.ok) {
        // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
        console.log("I have the response!");
        return resp.json();
      } else {
        throw new Error("I didn't get the info from bart :(");
      }
    })
    .then((bartStationETD: BartStationETD) => {
      const etdsForStation = bartStationETD.root.station[0].etd;
      const allEstimatesForEveryTrain: Array<number> = etdsForStation
        .map(train => train.estimate.map(etd => etd.minutes))
        .flat()
        .map(strMinutes =>
          strMinutes === "Leaving" ? 0 : parseInt(strMinutes)
        )
        .sort((a, b) => a - b);

      console.log("All estimates: ", allEstimatesForEveryTrain);
      return allEstimatesForEveryTrain;
    });
  return estimates;
};

// Overview
// 1. Get the data ✅
// 2. parse the data/format the data ✅
// 3. Show it off!
// ---
// 4. Allow opt url pararmeters (http://localhost:3000/#woak/s)

// https://bart.marcopolo.io/

// http://qwantz.com/

export default App;

// function bar() {
//   console.log("Hello from bar");
//   this.foo = "From bar";

//   const arrowFn = () =>
//     console.log("Arrow fn", (this && this.foo) || "Foo is not set");
//   arrowFn();

//   const nonArrowFn = function() {
//     console.log("Non arrow fn", (this && this.foo) || "Foo is not set");
//   };

//   const boundNonArrowFn = nonArrowFn.bind({ foo: "binded thing" });

//   nonArrowFn();
//   nonArrowFn.call({ foo: "SOMETHING ELSE" });
//   boundNonArrowFn();
// }

// bar.call({});
