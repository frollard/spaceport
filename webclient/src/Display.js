import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { Button, Container, Header } from 'semantic-ui-react';
import { requester } from './utils.js';
import { TrotecUsage } from './Usage.js';

const deviceNames = {
	'trotec': {title: 'Trotec', device: 'TROTECS300'},
};

export function LCARS1Display(props) {
	const { token } = props;
	const [fullElement, setFullElement] = useState(false);
	const ref = useRef(null);

	const goFullScreen = () => {
		if ('wakeLock' in navigator) {
			navigator.wakeLock.request('screen');
		}

		ref.current.requestFullscreen({ navigationUI: 'hide' }).then(() => {
			setFullElement(true);
		});
	};

	return (
		<Container>
			<div className='display' ref={ref}>

				{!fullElement &&
					<p>
						<Button onClick={goFullScreen}>Fullscreen</Button>
					</p>
				}

				<div></div>

				<div className='display-usage'>
					<DisplayUsage token={token} name={'trotec'} />
				</div>
			</div>
		</Container>
	);
};

export function DisplayUsage(props) {
	const { token, name } = props;
	const title = deviceNames[name].title;
	const device = deviceNames[name].device;
	const [usage, setUsage] = useState(false);

	const getUsage = () => {
		requester('/stats/usage_data/?device='+device, 'GET', token)
		.then(res => {
			setUsage(res);
		})
		.catch(err => {
			console.log(err);
			setUsage(false);
		});
	};

	useEffect(() => {
		getUsage();
		const interval = setInterval(getUsage, 60000);
		return () => clearInterval(interval);
	}, []);

	const showUsage = usage && usage.track.username === usage.username;

	return (
		<>
			{showUsage ?
				<TrotecUsage usage={usage} />
			:
				<>
					<Header size='medium'>Trotec Usage</Header>

					<p className='stat'>
						Waiting for job
					</p>
				</>
			}
		</>
	);
};
