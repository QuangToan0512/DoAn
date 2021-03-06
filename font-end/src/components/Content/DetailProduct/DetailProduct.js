/* eslint-disable */
import React, { useContext, useState } from 'react';
import '../../Header/advertisement/style.scss';
import '../../Header/menuHeader/style.module.css';
import Styles from './Style.module.scss';
import { Button, Card, Rate, Pagination, message, Empty, InputNumber } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import CommentProduct from './Comment/Comment';
import Footer from '../../Footer/footer';
import Chung from '../../Header/Chung';
import { useDispatch, useSelector } from 'react-redux';
import baseAPI from '../../../axios/baseAPI';
import { BASE_URL_IMAGE, TYPE_STORE, TypeApi } from '../../../util/TypeApi';
import { TYPE_ACTION } from '../../../actions/TypeAction';
import ReactImageMagnify from 'react-image-magnify';
import { ContextApp } from '../../../context/contextApp';
import CommentsContainer from '../../../baseComponent/comments/CommentsContainer';
import useCommentsLogic from '../../../hooks/useCommentsLogic';
const { Meta } = Card;
const key = 'updatable';
// import PropTypes from 'prop-types';
const pageSize = 8;

function DetailProduct() {
	const [getList] = useCommentsLogic();
	// hooks
	const { id } = useParams();
	const product = useSelector((state) => state['product']);
	const myUser = useSelector((state) => state['myUser']);
	const carts = useSelector((state) => state['carts']);
	const history = useHistory();
	const dispatch = useDispatch();
	const { setSelectedRowKeys } = useContext(ContextApp);
	const maxMount = product && product[id] && product[id].amount;
	// debugger;
	// filter
	const arrayProduct = Object.values(product).filter((item) => item._id === id);
	const listComments = useSelector((state) => state[TYPE_STORE.comment]);
	const comments = Object.values(listComments);
	// state
	const [objDetail, setObjDetail] = React.useState({});
	const [productSuggest, setProductSuggest] = React.useState([]);
	const [imageActive, setImageActive] = React.useState('');
	const [amount, setAmount] = React.useState(1);
	const [current, setCurrent] = useState(1);
	const [minIndex, setMinIndex] = useState(0);
	const [maxIndex, setMaxIndex] = useState(pageSize);

	let numberVote = 0;
	comments.map((item) => (numberVote += item.vote));
	const valueCommentTB =
		numberVote / comments.filter((value) => value.id_comment === '-1').length;

	const handleBuyProduct = async () => {
		const idCart = await handleAddCart(false);
		await setSelectedRowKeys([idCart]);
		(await myUser.email)
			? history.push(`/buyproduct`)
			: message.warn('B???n c???n ????ng nh???p ????? th???c hi???n ch???c n??ng n??y');
	};
	const handleAddCart = async (isMessage = true) => {
		const dataCart = {
			product_id: id,
			status: false,
			user_id: myUser._id,
			amount: amount,
		};
		const { message: messageAPI, cart } = await baseAPI.add(TypeApi.cart, dataCart);
		if (messageAPI === 'SUCCESS') {
			carts[cart._id] = cart;
			await dispatch({
				type: TYPE_ACTION.CART.ADD_CART,
				payload: { data: { ...carts } },
			});
			isMessage &&
				message.loading({
					className: 'message_success',
					content: '??ang th??m v??o gi??? c???a b???n!',
					key,
				});
			isMessage &&
				setTimeout(() => {
					message.success({
						className: 'message_success',
						content: 'Th??m v??o gi??? h??ng th??nh c??ng!',
						key,
						duration: 2,
					});
				}, 1000);
		} else {
			console.log('isMessage', isMessage);
			isMessage && message.warn(messageAPI);
		}
		return cart && cart._id && cart._id;
	};

	const getProduct = async (objParams, handleFunc, type) => {
		const data = await baseAPI.getAll(TypeApi.product, objParams);
		const arr = Object.values(data);
		arr.length > 0 && type === 'getId' ? handleFunc(arr[0]) : handleFunc(arr);
	};
	const handleChange = (page) => {
		setCurrent(page);
		setMinIndex((page - 1) * pageSize);
		setMaxIndex(page * pageSize);
	};

	const onChangeNumber = (value) => {
		setAmount(value);
	};
	React.useEffect(() => {
		window.scrollTo(0, 0);
		getList({ id_product: id })
			.then()
			.catch((err) => console.log(err));
		arrayProduct.length > 0
			? setObjDetail(arrayProduct[0])
			: getProduct({ _id: id }, setObjDetail, 'getId');
	}, [id]);
	React.useEffect(() => {
		if (Object.values(objDetail).length > 0) {
			getProduct({ catalog_id: objDetail.catalog_id }, setProductSuggest);
			setImageActive(objDetail.image_destination[0]);
		}
	}, [objDetail]);

	return (
		<div>
			<Chung />
			{Object.values(objDetail).length === 0 ? (
				<div className={Styles.content_detail}>
					<div
						style={{
							color: 'red',
							fontSize: 50,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Empty description={'Kh??ng t??m th???y s???n ph???m c???n t??m'} />
						<span>404</span>
					</div>
				</div>
			) : (
				<div className={Styles.content_detail}>
					<div className={Styles.perimeter}>
						<div className={Styles.image}>
							<ReactImageMagnify
								{...{
									smallImage: {
										alt: 'Wristwatch by Ted Baker London',
										isFluidWidth: true,
										src: `${BASE_URL_IMAGE}${imageActive}`,
										// srcSet: srcSet,
										sizes: '(min-width: 800px) 33.5vw, (min-width: 415px) 50vw, 100vw',
										className: 'mySlides',
									},
									largeImage: {
										alt: '',
										src: `${BASE_URL_IMAGE}${imageActive}`,
										width: 1200,
										height: 1200,
									},
									enlargedImageContainerStyle: {
										zIndex: '1500',
									},
									enlargedImageContainerDimensions: {
										width: '90%',
										height: '70%',
									},
									isHintEnabled: true,
								}}
							/>
							<div
								className={'flex_row'}
								style={{ marginTop: 10, justifyContent: 'center' }}
							>
								{objDetail.image_destination &&
									objDetail.image_destination.map((name) => (
										<img
											src={BASE_URL_IMAGE + name}
											style={{
												width: 65,
												height: 65,
												cursor: 'pointer',
												border: imageActive === name ? '1px solid red' : '1px solid #fff',
												objectFit: 'cover',
												marginLeft: 5,
											}}
											onClick={() => setImageActive(name)}
										/>
									))}
							</div>
						</div>
						<div className={Styles.copy}>
							<div className={Styles.copy_header_detail}>
								<h1>{objDetail.name}</h1>
								{/*<div className={Styles.action_header_detail}>*/}
								<div className={Styles.action_header_detail_item}>
									<div className={Styles.action_header_left}>
										<div className={Styles.action_thuong_hieu}>
											Th????ng hi???u: <p>GCB</p>
										</div>
									</div>
									<div className={Styles.action_thuong_hieu}>
										M?? SP:
										<span style={{ fontWeight: 'bold', paddingLeft: '6px' }}>
											{objDetail._id}
										</span>
									</div>
								</div>
								{/*</div>*/}
							</div>
							<div className={Styles.copy_content_detail}>
								<div style={{ display: 'flex' }}>
									<Rate allowHalf value={valueCommentTB} style={{ fontSize: '18px' }} />
									<div className={Styles.action_binh_luan} style={{ marginLeft: 10 }}>
										{' '}
										( {comments.filter((value) => value.id_comment === '-1').length} ????nh
										gi?? )
									</div>
								</div>
								<div className={Styles.copy_content_detail_item}>
									<div className={Styles.copy_content_detail_values}>
										{(
											(
												objDetail.price -
												(objDetail.price * objDetail.price_seo.split(' ')[0]) / 100
											).toFixed(2) * 1000
										)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}
									</div>
									{objDetail.price_seo !== '0 %' ? (
										<div style={{ width: '50%' }}>
											<span
												className={Styles.old_price}
												style={{
													textDecoration: 'line-through',
													color: '#f98282',
													fontSize: '18px',
													marginLeft: 8,
												}}
											>
												{(objDetail.price * 1000)
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ??'}
											</span>
											<span className={Styles.label_km}>
												Ti???t ki???m{' '}
												<span id="discount">
													{((objDetail.price * objDetail.price_seo.split(' ')[0]) / 100)
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' k'}
												</span>
											</span>
										</div>
									) : (
										<div style={{ width: '50%' }} />
									)}
								</div>
								<div className={Styles.copy_content_detail_item}>
									<div className={Styles.copy_content_detail_tinh_trang}>
										{objDetail.amount - objDetail['sold'] > 0 ? 'C??n h??ng' : 'H???t h??ng'}
									</div>
								</div>
								<div className={Styles.copy_content_detail_item}>
									<div className={Styles.copy_content_detail_title}>S??? l?????ng :</div>
									<div className={Styles.copy_content_detail_tinh_trang}>
										<InputNumber
											min={1}
											max={maxMount}
											defaultValue={1}
											onChange={onChangeNumber}
										/>
									</div>
								</div>
								<div className={Styles.copy_content_detail_item}>
									<div className={Styles.copy_content_detail_van_chuyen}>
										<span>
											<strong>Mi???n ph?? v???n chuy???n </strong>
											cho ????n h??ng tr??n <span style={{ color: 'red' }}>200.000??</span>
										</span>
									</div>
								</div>
								<div className={Styles.copy_action_detail}>
									{(Object.keys(myUser).length > 0 && localStorage.getItem('name') && localStorage.getItem('name').length > 0) ? (
										<React.Fragment>
											<div
												className={Styles.copy_action_mua}
												style={{
													display:
														objDetail.amount - objDetail['sold'] > 0 ? 'block' : 'none',
												}}
											>
												<Button
													type="primary"
													className={Styles.btn_detail_them_vao_gio}
													onClick={handleBuyProduct}
													style={{ width: 152.08 }}
												>
													Mua ngay
												</Button>
											</div>
											<div
												className={Styles.copy_action_gio}
												style={{
													display:
														objDetail.amount - objDetail['sold'] > 0 ? 'block' : 'none',
												}}
											>
												<Button
													className={Styles.btn_detail_them_vao_gio}
													style={{
														backgroundColor: 'white',
														border: '2px solid red',
														color: 'red',
													}}
													onClick={() => handleAddCart()}
													type="primary"
												>
													Th??m v??o gi??? h??ng
												</Button>
											</div>
										</React.Fragment>
									) : (
										<React.Fragment>
											<div
												className={Styles.copy_action_gio}
												style={{
													display:
														objDetail.amount - objDetail['sold'] > 0 ? 'block' : 'none',
												}}
											>
												<Button
													className={Styles.btn_detail}
													onClick={() => history.push('/login')}
													type="primary"
												>
													????ng nh???p ????? mua h??ng
												</Button>
											</div>
											<div
												className={Styles.copy_action_mua}
												style={{
													display:
														objDetail.amount - objDetail['sold'] > 0 ? 'block' : 'none',
												}}
											>
												<Button
													type="primary"
													className={Styles.btn_detail}
													style={{ width: 'unset !important' }}
													onClick={() => history.push('/login')}
												>
													????ng nh???p ????? th??m v??o gi??? h??ng
												</Button>
											</div>
										</React.Fragment>
									)}
								</div>
								<div>
									T???ng ????i mua h??ng mi???n c?????c{' '}
									<span style={{ color: '#ff3600', fontWeight: 'bold' }}>1900636467</span>{' '}
									( T??? 8h ?????n 21h30 h???ng ng??y )
								</div>
								{/*<div className={Styles.box_icon}>*/}
								{/*	<div className={Styles.box_icon_item}>*/}
								{/*		<span className={Styles.box_icon_ic_icon_ship} />*/}
								{/*		<span>*/}
								{/*			Giao h??ng <br /> to??n qu???c*/}
								{/*		</span>*/}
								{/*	</div>*/}
								{/*	<div className={Styles.box_icon_item}>*/}
								{/*		<span className={Styles.box_icon_bg_icon_ship} />*/}
								{/*		<span>*/}
								{/*			?????i h??ng 15 <br />*/}
								{/*			ng??y mi???n ph??*/}
								{/*		</span>*/}
								{/*	</div>*/}
								{/*	<div className={Styles.box_icon_item}>*/}
								{/*		<span className={Styles.box_icon_chinhhang} />*/}
								{/*		<span>*/}
								{/*			?????m b???o h??ng <br /> ch??nh h??ng*/}
								{/*		</span>*/}
								{/*	</div>*/}
								{/*</div>*/}
							</div>
						</div>
					</div>
					<div className={Styles.content_2}>
						<div className={Styles.title_banthich}>C?? th??? b???n th??ch</div>
						<div className={Styles.content_banthich}>
							{productSuggest.slice(0, 6).map((item) => (
								<Link to={`/detail/${item._id}`}>
									{item['price_seo'] !== '0 %' ? (
										<Card
											hoverable
											className={Styles.card_item_goi_y}
											cover={
												<img
													alt={item.image}
													src={BASE_URL_IMAGE + item.image}
													style={{ width: 178, height: 150 }}
												/>
											}
										>
											<Meta
												title={item.name}
												description={
													<div
														style={{
															color: '#ff6b00',
															fontWeight: 'bold',
														}}
													>
														<div>
															{(
																(
																	item.price -
																	(item.price * item.price_seo.split(' ')[0]) / 100
																).toFixed(2) * 1000
															)
																.toString()
																.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ??'}
														</div>
														<span className={Styles.old_price}>
															{(item.price * 1000)
																.toString()
																.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ??'}
														</span>
													</div>
												}
											/>
											<div className={Styles._2TDZGE}>
												<div className={Styles.percent}>{item['price_seo']}</div>
												<div className={Styles._17XqBU}>gi???m</div>
											</div>
										</Card>
									) : (
										<Card
											hoverable
											className={Styles.card_item_goi_y}
											cover={
												<img
													alt="????? ch??i ?? t?? th??? h??nh s??? ?????m XE30a"
													src={BASE_URL_IMAGE + item.image}
													style={{ width: 178, height: 150 }}
												/>
											}
										>
											<Meta
												title={item.name}
												description={
													<div
														style={{ color: '#ff6b00', fontSize: 14, fontWeight: 'bold' }}
													>
														{(item.price * 1000)
															.toString()
															.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VN??'}
													</div>
												}
											/>
										</Card>
									)}
								</Link>
							))}
						</div>
					</div>
					<div className={Styles.content_3}>
						<div className={Styles._3wdEZ5_2}>
							<div className={Styles._2pGc2E}>M?? T??? S???N PH???M</div>
							<div className={Styles._1afiLm_1}>
								<div dangerouslySetInnerHTML={{ __html: objDetail.description }} />
							</div>
						</div>
					</div>
					<div className={Styles.content_4}>
						<div className={Styles.product_ratings__header}>B??NH LU???N V??? S???N PH???M</div>
						<div className={Styles.item_binh_luan}>
							<div className={Styles.comment}>
								<CommentsContainer
									id_product={id}
									maxIndex={maxIndex}
									minIndex={minIndex}
								/>
							</div>
							<div className={Styles.pagination}>
								<Pagination
									size="small"
									pageSize={pageSize}
									current={current}
									total={comments.length}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className={Styles.footer_detail}>
				<Footer />
			</div>
		</div>
	);
}

DetailProduct.propTypes = {};

DetailProduct.defaultProps = {};

export default React.memo(DetailProduct);
