const { useState, useEffect } = require("react")

export function Countdown(props) {

    const timestamp = props.timestamp;
    const type = props.type;
    const duration = props.duration;
    const durationVoting = props.durationVoting;
    const status = props.status;

    const [count, setCount] = useState(0);

    const getNowSecond = () => {
        const now = new Date();
        return Math.floor(now / 1000)
    }


    /*eslint-disable */
    useEffect(() => {
        const updateTime = async () => {
            const nowSecond = getNowSecond()
            const diff = nowSecond - timestamp;
            let expireIn = duration - diff;
            if (type === 2 && expireIn < 0) {
                expireIn = durationVoting - diff;
            }
            if (expireIn > 0) {
                setCount(expireIn);
            } else {
                setCount(0);
            }
        }
        const interval = setInterval(() => updateTime(), 1000);
        return () => clearInterval(interval);
    }, [getNowSecond()]);
    /*eslint-enable */


    return (
        <h5 className="text-on-back">
            {(status === 0 || (type === 2 && count === 0)) ?
                <span>Ended</span>
                : count > 0 ?
                    <span>{count} s</span>
                    : <span></span>
            }
        </h5>

    )
}