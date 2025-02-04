import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './light.css';
import { Container, Form, Grid, Header, Input } from 'semantic-ui-react';
import { PayPalPayNow, PayPalSubscribe } from './PayPal.js';
import { MembersDropdown } from './Members.js';
import { requester } from './utils.js';

export function SendProtocoin(props) {
	const { token, user, refreshUser } = props;
	const member = user.member;
	const [input, setInput] = useState({});
	const [error, setError] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleValues = (e, v) => setInput({ ...input, [v.name]: v.value });
	const handleChange = (e) => handleValues(e, e.currentTarget);

	const handleSubmit = (e) => {
		if (loading) return;
		setSuccess(false);
		setLoading(true);

		const data = { ...input, balance: member.protocoin };
		requester('/protocoin/send_to_member/', 'POST', token, data)
		.then(res => {
			setLoading(false);
			setSuccess(true);
			setInput({});
			setError({});
			refreshUser();
		})
		.catch(err => {
			setLoading(false);
			console.log(err);
			setError(err.data);
		});
	};

	const makeProps = (name) => ({
		name: name,
		onChange: handleChange,
		value: input[name] || '',
		error: error[name],
	});

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group widths='equal'>
				<Form.Field error={error.member_id}>
					<label>Member (search)</label>
					<MembersDropdown
						token={token}
						{...makeProps('member_id')}
						onChange={handleValues}
					/>
				</Form.Field>

				<Form.Input
					label='Amount (₱)'
					fluid
					{...makeProps('amount')}
				/>
			</Form.Group>

			<Form.Button loading={loading} error={error.non_field_errors}>
				Send
			</Form.Button>
			{success && <div>Success!</div>}
		</Form>
	);
};

export function Paymaster(props) {
	const { token, user, refreshUser } = props;
	const [pop, setPop] = useState('20.00');
	const [locker, setLocker] = useState('5.00');
	const [consumables, setConsumables] = useState('20.00');
	const [buyProtocoin, setBuyProtocoin] = useState('10.00');
	const [consumablesMemo, setConsumablesMemo] = useState('');
	const [donate, setDonate] = useState('20.00');
	const [memo, setMemo] = useState('');

	const monthly_fees = user.member.monthly_fees || 55;

	return (
		<Container>
			<Header size='large'>Paymaster</Header>
			<p>Use these buttons to send money to Protospace.</p>

			<Header size='medium'>Protocoin</Header>
			<p>Protocoin is used to buy things from Protospace's vending machines. No cash value.</p>

			<p>Current balance: ₱&thinsp;{user.member.protocoin.toFixed(2)}</p>

			<p>Total circulation: ₱&thinsp;{user.member.total_protocoin.toFixed(2)}</p>

			<Grid stackable padded columns={2}>
				<Grid.Column width={5}>
					Buy any amount of Protocoin:

					<div className='pay-custom'>
						<Input
							fluid
							label={{ basic: true, content: '$' }}
							labelPosition='left'
							value={buyProtocoin}
							onChange={(e, v) => setBuyProtocoin(v.value)}
						/>
					</div>

					<PayPalPayNow
						amount={buyProtocoin}
						name='Protospace Protocoin'
						custom={JSON.stringify({ category: 'Exchange', member: user.member.id })}
					/>

					<p>See a director to purchase Protocoin with a different payment method.</p>
				</Grid.Column>

				<Grid.Column width={8}>
					<p>Send Protocoin:</p>
					<SendProtocoin token={token} user={user} refreshUser={refreshUser} />
				</Grid.Column>
			</Grid>

			<Header size='medium'>Member Dues</Header>
			<Grid stackable padded columns={3}>
				<Grid.Column>
					<p>Pay ${monthly_fees}.00 once:</p>
					<PayPalPayNow
						amount={monthly_fees}
						name='Protospace Membership'
						custom={JSON.stringify({ member: user.member.id })}
					/>
				</Grid.Column>

				<Grid.Column>
					<p>Subscribe ${monthly_fees}.00 / month:</p>
					<PayPalSubscribe
						amount={monthly_fees}
						name='Protospace Membership'
						custom={JSON.stringify({ member: user.member.id })}
					/>
				</Grid.Column>

				<Grid.Column>
					<p>Pay ${monthly_fees * 11}.00 for a year:</p>
					<PayPalPayNow
						amount={monthly_fees * 11}
						name='Protospace Membership'
						custom={JSON.stringify({ deal: 12, member: user.member.id })}
					/>
					<p>...get one month for free!</p>
				</Grid.Column>
			</Grid>

			<Header size='medium'>Consumables</Header>

			<p>Pay for materials you use (ie. welding gas, 3D printing, blades, etc).</p>

			<Grid stackable padded columns={1}>
				<Grid.Column>
					Custom amount:

					<div className='pay-custom'>
						<Input
							fluid
							label={{ basic: true, content: '$' }}
							labelPosition='left'
							value={consumables}
							onChange={(e, v) => setConsumables(v.value)}
						/>
					</div>

					<p>
						Please explain what you bought:<br/>
						<Input
							value={consumablesMemo}
							maxLength={50}
							onChange={(e, v) => setConsumablesMemo(v.value)}
						/>
					</p>

					<PayPalPayNow
						amount={consumables}
						name='Protospace Consumables'
						custom={JSON.stringify({ category: 'Consumables', member: user.member.id, memo: consumablesMemo })}
					/>
				</Grid.Column>
			</Grid>

			<Header size='medium'>Donate</Header>

			<Grid stackable padded columns={1}>
				<Grid.Column>
					Custom amount:

					<div className='pay-custom'>
						<Input
							fluid
							label={{ basic: true, content: '$' }}
							labelPosition='left'
							value={donate}
							onChange={(e, v) => setDonate(v.value)}
						/>
					</div>

					<p>
						Optional memo:<br/>
						<Input
							value={memo}
							maxLength={50}
							onChange={(e, v) => setMemo(v.value)}
						/>
					</p>

					<PayPalPayNow
						amount={donate}
						name='Protospace Donation'
						custom={JSON.stringify({ category: 'Donation', member: user.member.id, memo: memo })}
					/>
				</Grid.Column>
			</Grid>

			<Header size='medium'>Locker Storage</Header>

			<p>Confirm location and availability with <Link to='/members/392'>Scott Young</Link> before subscribing.</p>

			<Grid stackable padded columns={1}>
				<Grid.Column>
					Custom amount:

					<div className='pay-custom'>
						<Input
							fluid
							label={{ basic: true, content: '$' }}
							labelPosition='left'
							value={locker}
							onChange={(e, v) => setLocker(v.value)}
						/>
					</div>

					<PayPalSubscribe
						amount={locker}
						name='Protospace Locker'
						custom={JSON.stringify({ memo: 'Locker Rental', category: 'Purchases', member: user.member.id })}
					/>
				</Grid.Column>
			</Grid>
		</Container>
	);
};
