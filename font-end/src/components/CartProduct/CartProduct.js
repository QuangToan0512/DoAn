/* eslint-disable */
import React, { useContext, useState } from 'react';
import { Input, Popconfirm, Avatar, Button, message, Table, Modal } from 'antd';
import queryString from 'query-string';
// import PropTypes from 'prop-types';
import Styles from './style.module.css';
import logo from '../../img/logo.jpg';
import { Link, useHistory } from 'react-router-dom';
import PopupBuyProduct from './PopupBuyProduct/PopupBuyProduct';
import Footer from '../Footer/footer';
import useCartLogicData from '../../hooks/useCartLogicData';
import useProductLogicData from '../../hooks/useProductLogicData';
import { ContextApp } from '../../context/contextApp';
import { BASE_URL_IMAGE } from '../../util/TypeApi';
import Draggable from 'react-draggable';
const { Search } = Input;
const text = 'Are you sure to delete this task?';

function CartProduct() {
	// hooks
	const { carts, deleteCart, getListCart } = useCartLogicData();
	const { product, getListProduct } = useProductLogicData();
	const history = useHistory();
	const { selectedRowKeys, setSelectedRowKeys } = useContext(ContextApp);

	// state
	const [modal2Visible, setModal2Visible] = React.useState(false);
	const [bounds, setBounds] = useState({
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	});

	// const
	const { location } = history;
	const draggleRef = React.createRef();
	const parsed = queryString.parse(location.search);
	const arrCarts = Object.values(carts).filter(
		(item) => parsed && parsed.id !== item._id
	);
	const arrSelect = Object.values(carts).filter(
		(item) => parsed && parsed.id === item._id
	);
	const _selectedRowKeys = selectedRowKeys.filter((item) => item !== parsed.id);
	const arrOutOfStock = React.useMemo(
		() =>
			Object.keys(carts).filter(
				(id) =>
					carts[id] &&
					product[carts[id].product_id] &&
					product[carts[id].product_id].amount - product[carts[id].product_id].sold === 0
			),
		[carts, product]
	);

	const arrCartTable = arrSelect
		.concat(arrCarts.reverse())
		.filter((item) => !item.status);

	// handle func
	const onSelectChange = (_selectedRowKeys) => {
		setSelectedRowKeys(_selectedRowKeys);
	};

	const handleDeleteOption = () => {
		_selectedRowKeys.map(async (idCart) => await deleteCart(idCart));
	};
	const onSearch = (value) => console.log(value);

	const handleClickBuyAllProduct = () => {
		if (_selectedRowKeys.length === 0) {
			message.error('H??y ch???n s???n ph???m ????? th???c hi???n ch???c n??ng n??y');
		} else {
			setModal2Visible(true);
		}
	};

	const handleFindIndex = () => {
		if (parsed && parsed.id) {
			setSelectedRowKeys([parsed.id]);
		}

		// N???u ???? h???t h??ng th?? s??? l???i b??? id ???? ra kh???i array
		if (arrOutOfStock.includes(parsed.id)) {
			setSelectedRowKeys([..._selectedRowKeys]);
		}
	};
	const onPushPageBuy = () => {
		if (selectedRowKeys.length > 0) {
			history.push('/buyproduct');
		} else {
			message.warn('B???n c???n t??ch ch???n ????? ?????t mua');
		}
	};
	const onStart = (event, uiData) => {
		const { clientWidth, clientHeight } =
			window && window.document && window.document.documentElement;
		const targetRect =
			draggleRef && draggleRef.current && draggleRef.current.getBoundingClientRect();
		setBounds({
			left: -targetRect && -targetRect.left + uiData && uiData.x,
			right: clientWidth - (targetRect && targetRect.right - uiData && uiData.x),
			top: -targetRect.top + uiData.y,
			bottom: clientHeight - (targetRect.bottom - uiData.y),
		});
	};

	// V??ng ?????i
	React.useEffect(() => {
		getListCart().catch((error) => console.log('error:', error));
		getListProduct().catch((error) => console.log('error:', error));
	}, []);

	React.useEffect(() => {
		handleFindIndex();
	}, [carts, product]);

	// IF n??y ????? check tr?????ng h???p d??? li???u tr??? v??? null d???n ?????n d??? li???u b??? l???i
	if (Object.keys(carts).length === 0 || Object.keys(product).length === 0) return null;
	// JSX
	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
		},
		{
			title: (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<div> T??n s???n ph???m </div>{' '}
					<div>
						<Button
							onClick={handleDeleteOption}
							style={{
								marginRight: '5px',
							}}
							danger
						>
							X??a s???n ph???m ???? ch???n
						</Button>{' '}
						{/*<Button onClick={handleClickBuyAllProduct}> Xem s???n ph???m ???? ch???n </Button>{' '}*/}
						<Button
							style={{
								backgroundColor: '#ee4d2d',
								color: '#fff',
							}}
							onClick={onPushPageBuy}
						>
							{' '}
							Mua s???n ph???m ???? ch???n
						</Button>{' '}
						<Modal
							title={
								<div
									style={{
										color: '#e728ce',
										marginLeft: '400px',
										fontSize: '18px',
									}}
								>
									DANH S??CH C??C S???N PH???M ???? CH???N{' '}
								</div>
							}
							centered
							visible={modal2Visible}
							onOk={() => setModal2Visible(false)}
							footer={null}
							onCancel={() => setModal2Visible(false)}
							className={Styles.modal_xem_tat_ca}
							style={{
								width: '1200px',
							}}
							modalRender={(modal) => (
								<Draggable
									bounds={bounds}
									onStart={(event, uiData) => onStart(event, uiData)}
								>
									<div ref={draggleRef}> {modal} </div>{' '}
								</Draggable>
							)}
						>
							<PopupBuyProduct
								setModal2Visible={setModal2Visible}
								selectedRowKeys={_selectedRowKeys}
								product={product}
								carts={carts}
							/>{' '}
						</Modal>{' '}
					</div>{' '}
				</div>
			),
			dataIndex: 'name',
		},
		{
			title: 'Gi?? 1 s???n ph???m',
			dataIndex: 'price',
		},
		{
			title: 'S??? l?????ng',
			dataIndex: 'number',
		},
		{
			title: 'T???ng ti???n',
			dataIndex: 'total',
		},
		{
			title: 'H??nh ?????ng',
			dataIndex: 'action',
		},
	];
	const rowSelection = {
		_selectedRowKeys,
		onChange: onSelectChange,
		getCheckboxProps: (record) => {
			const isCheck =
				product[carts[record.key].product_id].amount -
					product[carts[record.key].product_id].sold ===
				0;
			return {
				disabled: isCheck,
				checked: !isCheck,
				name: record.name,
			};
		},
		selections: [
			Table.SELECTION_ALL,
			Table.SELECTION_INVERT,
			Table.SELECTION_NONE,
			{
				key: 'odd',
				text: 'Select Odd Row',
				onSelect: (changableRowKeys) => {
					// console.log('changableRowKeys', changableRowKeys);
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changableRowKeys.filter((key, index) => {
						if (index % 2 !== 0) {
							return false;
						}
						return true;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
			{
				key: 'even',
				text: 'Select Even Row',
				onSelect: (changableRowKeys) => {
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changableRowKeys.filter((key, index) => {
						if (index % 2 !== 0) {
							return true;
						}
						return false;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
		],
	};
	const dataTable = arrCartTable.map((item, i) => {
		return {
			key: item._id,
			stt: i + 1,
			name: (
				<div
					style={{
						display: 'flex',
						width: '500px',
					}}
				>
					<Avatar
						src={
							product &&
							product[item.product_id] &&
							BASE_URL_IMAGE + product[item.product_id].image
						}
						style={{
							width: '50px',
							height: '50px',
						}}
					/>{' '}
					<div
						style={{
							marginLeft: '15px',
						}}
					>
						{' '}
						{product && product[item.product_id] && product[item.product_id].name}{' '}
					</div>{' '}
				</div>
			),
			price: (
				<div className={Styles.gia_item_cart}>
					<div
						style={{
							textDecorationLine:
								product[item.product_id] && product[item.product_id].price_seo !== '0 %'
									? 'line-through'
									: 'none',
						}}
					>
						{' '}
						{`${
							product && product[item.product_id] && product[item.product_id].price * 1000
						}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}{' '}
					</div>
					<div>
						{product &&
							product[item.product_id] &&
							(
								(
									product[item.product_id].price -
									(product[item.product_id].price *
										product[item.product_id].price_seo.split(' ')[0]) /
										100
								).toFixed(2) * 1000
							)
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}
					</div>
				</div>
			),
			number: item.amount,
			total: (
				<span
					style={{
						color: 'red',
					}}
				>
					{product &&
						product[item.product_id] &&
						(
							(
								product[item.product_id].price -
								(product[item.product_id].price *
									product[item.product_id].price_seo.split(' ')[0]) /
									100
							).toFixed(2) *
							1000 *
							item.amount
						)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}
				</span>
			),
			action: (
				<div className={Styles.action_item_cart}>
					{' '}
					{product[item.product_id].amount - product[item.product_id].sold === 0 ? (
						<Button
							style={{
								backgroundColor: '#bcb2b2',
								color: '#fff',
							}}
							disabled
						>
							???? h???t h??ng{' '}
						</Button>
					) : (
						<Button
							style={{
								backgroundColor: '#ee4d2d',
								color: '#fff',
							}}
							onClick={onPushPageBuy}
							disabled={selectedRowKeys.length > 1}
						>
							Mua h??ng{' '}
						</Button>
					)}{' '}
					<Popconfirm
						placement="topLeft"
						title={text}
						onConfirm={() => deleteCart(item._id)}
						okText="Yes"
						cancelText="No"
					>
						<Button
							type="text"
							style={{
								color: '#9f643c',
							}}
						>
							Xo??{' '}
						</Button>{' '}
					</Popconfirm>{' '}
				</div>
			),
		};
	});
	return (
		<div>
			<div className={Styles.form_cart}>
				<div className={Styles.header_cart}>
					<div className={Styles.container_wrapper}>
						<div className={Styles.container}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div className={Styles.img_header_cart}>
									<Link to={'/'}>
										<img alt={logo} src={logo} />{' '}
									</Link>{' '}
									<div className={Styles.gio_hang}> Gi??? h??ng </div>{' '}
								</div>{' '}
								{/*<div className={Styles.search_header_cart}>*/}
								{/*	<Search*/}
								{/*		placeholder="input search text"*/}
								{/*		allowClear*/}
								{/*		enterButton="Search"*/}
								{/*		size="large"*/}
								{/*		onSearch={onSearch}*/}
								{/*		style={{*/}
								{/*			backgroundColor: '#f05d40',*/}
								{/*		}}*/}
								{/*	/>{' '}*/}
								{/*</div>{' '}*/}
							</div>{' '}
						</div>{' '}
					</div>{' '}
				</div>{' '}
				<div className={Styles.content_wart_cart}>
					<div className={Styles.content_cart}>
						<Table
							rowSelection={rowSelection}
							columns={columns}
							dataSource={dataTable}
							pagination={false}
						/>{' '}
					</div>{' '}
				</div>{' '}
			</div>{' '}
			<div className={Styles.footer_wart_cart}>
				<Footer />
			</div>{' '}
		</div>
	);
}

CartProduct.propTypes = {};

CartProduct.defaultProps = {};

export default React.memo(CartProduct);
