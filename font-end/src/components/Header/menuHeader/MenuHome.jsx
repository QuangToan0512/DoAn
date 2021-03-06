/* eslint-disable */
import React from 'react';
import { Button, Input, Dropdown, Menu, Badge, message } from 'antd';
import { UserOutlined, HeartTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Styles from './style.module.css';
import logo from '../../../img/logo.jpg';
import { Link, useHistory } from 'react-router-dom';
import img from '../../../img/banner1.png';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'antd/es/avatar/avatar';
import { TYPE_ACTION } from '../../../actions/TypeAction';
import { BASE_URL_IMAGE, TypeApi } from '../../../util/TypeApi';
import baseAPI from '../../../axios/baseAPI';
import useCartLogicData from '../../../hooks/useCartLogicData';
import useProductLogicData from '../../../hooks/useProductLogicData';
import { ContextApp } from '../../../context/contextApp';
import styled from 'styled-components';
//style
const stylIcon = { position: 'relative' };

// const
const { Search } = Input;
const WrapSearch = styled(Search)`
	.ant-input {
		border-radius: 8px;
	}
	.ant-input-group-addon {
		.ant-btn-primary {
			background-color: red;
			border-color: red;
			border-top-right-radius: 7px !important;
			border-bottom-right-radius: 7px !important;
		}
		& > button {
			border-radius: 8px;
			background-color: red;
		}
	}
`;
const WrapBadge = styled(Badge)`
	position: absolute;
`;
function MenuHome() {
	// hooks
	const myUser = useSelector((state) => state['myUser']);
	const { carts, getListCart } = useCartLogicData();
	const { product, getListProduct } = useProductLogicData();
	// const product = useSelector((state) => state['product']);
	const dispatch = useDispatch();
	const history = useHistory();

	// context
	const { setTextSearch } = React.useContext(ContextApp);

	// const
	const arrCarts = Object.values(carts).filter((item) => !item.status);

	// handle func
	const onSearch = (value) => setTextSearch(value);

	const handleClick = (event) => {
		switch (event.key) {
			case 'USER':
				history.push('/account?show=1');
				break;
			case 'DONHANG':
				history.push('/account?show=2');
				break;
			case 'LOGOUT':
				localStorage.clear();
				dispatch({ type: TYPE_ACTION.USER.LOGOUT });
				dispatch({ type: TYPE_ACTION.CART.CLEAR_LOGOUT });
				history.push('/');
				break;
			default:
			// code block
		}
	};
	const handleGetListCart = async (dataPrams) => {
		const data = await baseAPI.getAll(TypeApi.cart, dataPrams);
		dispatch({ type: TYPE_ACTION.CART.GET_ALL_CART, payload: { data } });
	};

	// const
	const handleClickMenuCart = (e) => {
		switch (e.key) {
			case 'XEM_THEM':
				history.push('/cart');
				break;
			default:
				history.push(`/cart?id=${e.key}`); // Note: e.key ch??nh l?? id product
				break;
		}
	};

	// X??? l?? v??ng ?????i
	React.useEffect(() => {
		myUser && myUser._id && getListCart();
	}, [myUser]);
	React.useEffect(() => {
		getListProduct();
	}, []);
	const menu = <React.Fragment></React.Fragment>;
	// 	!myUser.email ? (
	// 	<React.Fragment></React.Fragment>
	// ) : (
	// 	<Menu
	// 		onClick={handleClickMenuCart}
	// 		style={{ width: '500px', backgroundColor: '#efe6ef' }}
	// 	>
	// 		<span
	// 			style={{
	// 				color: '#FF0000',
	// 				marginLeft: '20px',
	// 				fontSize: '16px',
	// 				paddingTop: '10px',
	// 			}}
	// 		>
	// 			S???N PH???M ???? TH??M
	// 		</span>
	// 		<hr
	// 			style={{
	// 				height: '1px',
	// 				borderWidth: '0',
	// 			}}
	// 		/>
	// 		{arrCarts
	// 			.reverse()
	// 			.slice(0, 4)
	// 			.map((item) => (
	// 				<Menu.Item key={item._id} style={{ marginTop: '20px' }}>
	// 					<div className={Styles.hover_cart}>
	// 						<div className={Styles.img_hover_cart}>
	// 							<img
	// 								alt={item.image}
	// 								src={
	// 									product &&
	// 									product[item.product_id] &&
	// 									BASE_URL_IMAGE + product[item.product_id].image
	// 								}
	// 								style={{ width: 50, height: 50 }}
	// 							/>
	// 						</div>
	// 						<div className={Styles.span_hover_cart}>
	// 							{product && product[item.product_id] && product[item.product_id].name}
	// 						</div>
	// 						<div className={Styles.gia_hover_cart}>
	// 							{`${
	// 								product &&
	// 								product[item.product_id] &&
	// 								product[item.product_id].price * 1000
	// 							}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}
	// 						</div>
	// 					</div>
	// 				</Menu.Item>
	// 			))}
	// 		<hr
	// 			style={{
	// 				height: '2px',
	// 				borderWidth: '0',
	// 			}}
	// 		/>
	// 		<Menu.Item key="XEM_THEM">
	// 			<div
	// 				style={{
	// 					display: 'flex',
	// 					justifyContent: 'space-between',
	// 					marginTop: '10px',
	// 				}}
	// 			>
	// 				<div>Trong gi??? h??ng hi???n ??ang c?? : {`${arrCarts.length} s???n ph???m`}</div>
	// 				<div>
	// 					<Button
	// 						style={{
	// 							backgroundColor: '#1890ff',
	// 							height: '40px',
	// 							color: '#1890ff',
	// 							boxShadow:
	// 								'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
	// 						}}
	// 					>
	// 						Xem gi??? h??ng
	// 					</Button>
	// 				</div>
	// 			</div>
	// 		</Menu.Item>
	// 	</Menu>
	// );
	const menuUser = (
		<Menu onClick={handleClick}>
			<Menu.Item key="USER">
				<div>T??i kho???n</div>
			</Menu.Item>
			<Menu.Item key="DONHANG">
				<div>????n ?????t h??ng</div>
			</Menu.Item>
			<Menu.Item key="LOGOUT">
				<div>????ng xu???t</div>
			</Menu.Item>
		</Menu>
	);
	return (
		<div className={Styles.menu_header}>
			<div className={Styles.logo} style={{ height: '100%' }}>
				<Link to={'/'}>
					<img src={logo} />
				</Link>
			</div>
			<div className={Styles.search}>
				<WrapSearch
					placeholder="B???n mu???n t??m ki???m lo???i s??ch n??o ?"
					onSearch={onSearch}
					enterButton
				/>
			</div>
			<div className={Styles.singIn_singOut}>
				<div style={stylIcon}>
					<Dropdown overlay={menu}>
						<Link to={'/cart'}>
							{myUser.email && <WrapBadge size="small" count={arrCarts.length} />}
							<Button
								icon={<ShoppingCartOutlined style={{ 'font-size': '16px' }} />}
								type="text"
							>
								Gi??? h??ng
							</Button>
						</Link>
					</Dropdown>
				</div>
				{/*<div style={stylIcon}>*/}
				{/*	<Badge size="small" count={0}>*/}
				{/*		<Button*/}
				{/*			icon={<HeartTwoTone twoToneColor="#eb2f96" />}*/}
				{/*			style={{ color: '#eb2f96' }}*/}
				{/*			type="text"*/}
				{/*		>*/}
				{/*			Y??u th??ch*/}
				{/*		</Button>*/}
				{/*	</Badge>*/}
				{/*</div>*/}
				{myUser.email ? (
					<Dropdown overlay={menuUser}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								cursor: 'pointer',
							}}
						>
							<Avatar
								style={{ width: '30px', height: '30px' }}
								icon={<UserOutlined />}
								src={`${BASE_URL_IMAGE}${myUser.image}`}
							/>
							<div style={{ marginLeft: 5, marginTop: 5, fontWeight: 'bold' }}>
								{myUser.name}
							</div>
						</div>
					</Dropdown>
				) : (
					<React.Fragment>
						<div style={stylIcon}>
							<Link to={'/login'}>
								<Button
									icon={<UserOutlined style={{ 'font-size': '16px' }} />}
									type="text"
								>
									????ng nh???p
								</Button>
							</Link>
						</div>
						<div style={stylIcon}>
							<Link to={'/register'}>
								<Button
									icon={<UserOutlined style={{ 'font-size': '16px' }} />}
									type="text"
								>
									????ng k??
								</Button>
							</Link>
						</div>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}

export default React.memo(MenuHome);
