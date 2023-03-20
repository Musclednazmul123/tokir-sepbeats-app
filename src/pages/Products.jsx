import { Layout, Badge, Heading, ButtonGroup, DataTable, Button, Card, EmptyState, Page, TextField, Icon, Stack, Avatar, Image, Modal, FormLayout, Select, Checkbox, DropZone, Thumbnail, TextStyle, Pagination } from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import Switch from "react-switch";
import { TitleBar, useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import { Axios } from  "../Axios";
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { ChevronDownMinor, SearchMinor, NoteMinor, SearchMajor, DeleteMajor, AnalyticsMajor, EditMajor } from "@shopify/polaris-icons";
import { useNavigate } from "react-router";



// const fs = require('fs');
// const AWS = require('aws-sdk');
import {
    announceIcon,
    logoImage, 
    creditIcon,
    notification,
    closeImage
  } from '../assets';

export default function Products() {
    const { show } = useToast();
    const {replace} = useNavigationHistory();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(25);

    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);
    let [priceChecked, setPriceChecked] = useState(false);

    const [searchValue, setSeachValue] = useState("");
    const searchInputOnChange = useCallback((searchValue) => setSeachValue(searchValue),[searchValue]);
    const [searchType, setSeachType] = useState("all");
    const searchTypeOnChange = useCallback((searchType) => setSeachType(searchType),[searchType]);

    const [creating_product, setCreatingProduct] = useState(false);

    const [files, setFiles] = useState([]);

    const [products, setProducts] = useState(fake_products);

    const [price, setPrice] = useState("$50.00");
    const [description, setDescription] = useState("");
    const [title_name, setTitleName] = useState("");
    const [genre, setGenre] = useState("");
    const [current_page, setPage] = useState(1);
    const [pagination, setPagination] = useState(default_pagination);

    const handleDescription = useCallback((description) => {setDescription(description)},[description]);
    const handleTitleName = useCallback((title_name) => {setTitleName(title_name)},[title_name]);
    const handleGenre = useCallback((genre) => {setGenre(genre)},[genre]);

    const handlePrice = useCallback(
        (price) => {
            setPrice(price);
        },
        [price]
    );

    const [videoSrc, setVideoSrc] = useState(null);
    const handleChanged = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setVideoSrc(URL.createObjectURL(file));
    };

    const handleDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const [file, setFile] = useState()

    function handleChangex(event) {
        setFile(event.target.files[0])
    }

    const videoRef = useRef();
    useEffect(() => {
    videoRef.current?.load();
    }, [videoSrc]);

    const [selectedImage, setSelectedImage] = useState(null);

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
        
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                        validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                    }
                    />
                    <div>
                    {file.name}{' '}
                    <TextStyle ext variant="bodySm" as="p">
                        {file.size} bytes
                    </TextStyle>
                    </div>
                </Stack>
                ))}
            </Stack>
        </div>
    );

    useEffect(() => {
        getProducts(current_page);
    }, []);

    function getProducts(page){
        Axios({
            type: "get",
            url: "/merchant/products?shop="+store("shop")+"&page="+page,
            headers: {
            'Content-Type': 'application/json'
            },
        }, function(error, data){
            if (data) {
                if(data && data.collections){
                    console.log("data.collections", data.collections);
                    setProducts(data.collections);
                }
                else{
                    setProducts([]);
                }
                if(data && data.paginate){
                    console.log("", data.paginate);
                    setPagination(data.paginate);    
                }
            } 
            else{
                setProducts([]);
                console.error(error);
            }
            setLoading(false);
        });
    }

    function createProductAPI() {
        const file_name = files[0].name;
        console.log("filessssssssssss", file_name);


        var reader = new FileReader();
        reader.readAsDataURL(files[0]); 
        reader.onloadend = function() {
            var base64data = reader.result;
            setLoading(true);
            setActive(false);
            var add_product = {
                shop: store("shop"),
                title: title_name,
                price:price,
                genre: genre,
                description: description,
                files: base64data
            };
            Axios(
            {
                type: "post",
                url: "/merchant/add_product",
                data: JSON.stringify(add_product),
                headers: {
                    "Content-Type": "application/json",
                },
            },
            function (error, success) {
                if (error) {
                    setCreatingProduct(false);
                } else {
                    if (success && success.success && success.success._id) {
                        console.log("successzzzzzzzzz",success);
                        setCreatingProduct(false);
                        setActive(true);
                        show("Product Created Successfully");
                        getProducts(1);
                        setLoading(false);
                        setProducts(false);
                    }
                }
            }
        );
        }
    }

    const searchIcon = <Icon source={SearchMinor} />;
    // if (loading) {
    //     return (
    //         <Page fullWidth>
    //             <Card>
    //                 <Card.Section>
    //                     <SkeletonBodyText lines={1}></SkeletonBodyText>
    //                 </Card.Section>
    //                 <Card.Section>
    //                     <SkeletonBodyText lines={1}></SkeletonBodyText>
    //                 </Card.Section>
    //                 <Card.Section>
    //                     <SkeletonBodyText lines={1}></SkeletonBodyText>
    //                 </Card.Section>
    //                 <Card.Section>
    //                     <SkeletonBodyText lines={1}></SkeletonBodyText>
    //                 </Card.Section>
    //                 <Card.Section>
    //                     <SkeletonBodyText lines={1}></SkeletonBodyText>
    //                 </Card.Section>
    //             </Card>
    //         </Page>
    //     )
    // }

    if(products.length == 0){
        return(
          <Page fullWidth>
          <Card sectioned subdued>
                <Stack vertical spacing="loose">
                    <Stack distribution="equalSpacing">
                        <Stack spacing="loose">
                            <Image source={logoImage} />
                            <TextField
                            label="Search"
                            suffix={searchIcon}
                            inputMode="text"
                            placeholder="Search Products"
                            autoComplete="off"
                            // onChange={onChangeHandler}
                            // value={value}
                            labelHidden
                            />
                        </Stack>
                        <Stack alignment="center" spacing="loose">
                            <Button primary onClick={handleChange}>+ Add New Pack</Button>
                            <Image source={announceIcon} height={14} />
                            <Image source={notification} height={14} />
                            <Stack alignment="center" spacing="tight">
                            <Avatar customer name="Farrah" />
                            <Icon source={ChevronDownMinor} />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack distribution="equalSpacing">
                        <Stack spacing="loose">
                            <ul className="menu-list">
                                <li onClick={() => navigate(`/`)} className="menu-item">
                                    <a>Explore</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Samples</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Packs</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Selections</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Creators</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Mix</a>
                                    <span className="underline"></span>
                                </li>
                            </ul>
                        </Stack>
                        <Stack>
                            <ul className="menu-list">
                                <li className="menu-item">
                                    <a>My Account</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item credit-icon">
                                    <Stack spacing="tight">
                                    <a>0 credits</a>
                                    <Image source={creditIcon} />
                                    </Stack>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Downloads</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Links</a>
                                    <span className="underline"></span>
                                </li>
                            </ul>
                        </Stack>
                    </Stack>
                </Stack>
            </Card>
            <Modal
                open={!active} 
                onClose={handleChange}
                title="PACK DETAILS"
                primaryAction={{
                    content: 'Save',
                    onAction: () => {
                        setCreatingProduct(true);
                        createProductAPI();
                    }, 
                }}
            >
                <div className="modal-class">
                    <Modal.Section>
                            <FormLayout>
                                <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={title_name}
                                                onChange={handleTitleName}
                                                placeholder="Pack Title"
                                            />
                                            <Select
                                                label="Genre(!)"
                                                labelHidden
                                                value={genre}
                                                onChange={handleGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            />
                                            <Checkbox
                                                label={<p className="checkbox">Set Price</p>}
                                                checked={priceChecked}
                                                onChange={(newChecked) => {
                                                    setPriceChecked(newChecked);
                                                }}
                                                />
                                                {priceChecked && (
                                                    <TextField
                                                        label=""
                                                        value={price}
                                                        onChange={handlePrice}
                                                        placeholder="$50.00"
                                                    />
                                                )}
                                            <TextField
                                                value={description}
                                                onChange={handleDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleDropZoneDrop}>
                                                {uploadedFiles}
                                                {fileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Modal.Section>
                    </div>
            </Modal>
            <Layout>
              <Layout.Section>
              <Card sectioned>
              <EmptyState
                heading="This is where you'll manage your products"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>You can create a new product or import your product inventory</p>
                <div style={{marginTop: "10px"}}>
                <Button primary onClick={handleChange}>+ Add New Pack</Button>
                </div>
              </EmptyState>
            </Card>
              </Layout.Section>
            </Layout>
          </Page>
        )
    }

    return (
        <Page fullWidth>
            <Card sectioned subdued>
                <Stack vertical spacing="loose">
                    <Stack distribution="equalSpacing">
                        <Stack spacing="loose">
                            <Image source={logoImage} />
                            <TextField
                            label="Search"
                            suffix={searchIcon}
                            inputMode="text"
                            placeholder="Search Products"
                            autoComplete="off"
                            // onChange={onChangeHandler}
                            // value={value}
                            labelHidden
                            />
                        </Stack>
                        <Stack alignment="center" spacing="loose">
                            <Button primary onClick={handleChange}>+ Add New Pack</Button>
                            <Image source={announceIcon} height={14} />
                            <Image source={notification} height={14} />
                            <Stack alignment="center" spacing="tight">
                            <Avatar customer name="Farrah" />
                            <Icon source={ChevronDownMinor} />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack distribution="equalSpacing">
                        <Stack spacing="loose">
                            <ul className="menu-list">
                                <li onClick={() => navigate(`/`)} className="menu-item">
                                    <a>Explore</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Samples</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Packs</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Selections</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Creators</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Mix</a>
                                    <span className="underline"></span>
                                </li>
                            </ul>
                        </Stack>
                        <Stack>
                            <ul className="menu-list">
                                <li className="menu-item">
                                    <a>My Account</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item credit-icon">
                                    <Stack spacing="tight">
                                    <a>0 credits</a>
                                    <Image source={creditIcon} />
                                    </Stack>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Downloads</a>
                                    <span className="underline"></span>
                                </li>
                                <li className="menu-item">
                                    <a>Links</a>
                                    <span className="underline"></span>
                                </li>
                            </ul>
                        </Stack>
                    </Stack>
                </Stack>
            </Card>
            <Modal
                open={!active} 
                onClose={handleChange}
                title="PACK DETAILS"
                primaryAction={{
                    content: 'Save',
                    onAction: () => {
                        setCreatingProduct(true);
                        createProductAPI();
                    }, 
                }}
            >
                <div className="modal-class">
                    <Modal.Section>
                            <FormLayout>
                                <FormLayout.Group>
                                        <Stack vertical>
                                            <TextField
                                                label=""
                                                value={title_name}
                                                onChange={handleTitleName}
                                                placeholder="Pack Title"
                                            />
                                            <Select
                                                label="Genre"
                                                labelHidden
                                                value={genre}
                                                onChange={handleGenre}
                                                options={[
                                                    {
                                                        label: "Products",
                                                        value: "products"
                                                    },
                                                    {
                                                        label: "Variants",
                                                        value: "variants"
                                                    }
                                                ]}
                                            />
                                            <Checkbox
                                                label={<p className="checkbox">Set Price</p>}
                                                checked={priceChecked}
                                                onChange={(newChecked) => {
                                                    setPriceChecked(newChecked);
                                                }}
                                                />
                                                {priceChecked && (
                                                    <TextField
                                                        label=""
                                                        value={price}
                                                        onChange={handlePrice}
                                                        placeholder="$50.00"
                                                    />
                                                )}
                                            <TextField
                                                value={description}
                                                onChange={handleDescription}
                                                multiline={4}
                                                autoComplete="off"
                                                placeholder="Descriptions"
                                            />
                                            <DropZone onDrop={handleDropZoneDrop}>
                                                {uploadedFiles}
                                                {fileUpload}
                                            </DropZone>
                                            <div className="clear_container">
                                                <Stack.Item>
                                                    <a className="imageClear">Clear</a>
                                                    <Image
                                                        source={closeImage}
                                                        width="9px"
                                                        height="9px"
                                                    />
                                                </Stack.Item>
                                            </div>
                                        </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Modal.Section>
                    </div>
            </Modal>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Card.Section>
                            <Stack vertical spacing="extraLoose">
                            <Stack.Item>
                                <DataProductsTable
                                searchType={searchType}
                                searchValue={searchValue}
                                rows={products}
                                products={products}
                                callback={(f_products) => {
                                    setproducts(f_products);
                                    // setLoading(true);
                                }}
                                onUpdate={() => {
                                    setLoading(false);
                                    setPage(1);
                                    getProducts(1);
                                }}
                                onEditClick={(item) => {
                                    // setEditModalActive(true);
                                }}
                                onDeleteClick={(item) => {
                                    // setDeleteOfferId(item._id);
                                    // setDeleteModalActive(true);
                                }}
                                ></DataProductsTable>
                            </Stack.Item>
                            </Stack>
                        </Card.Section>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Stack alignment="center" distribution="center">
                    <Pagination
                        hasNext={pagination.next_page}
                        hasPrevious={pagination.prev_page}
                        onNext={() => {
                            var nxt_pg = current_page + 1;
                            setPage(nxt_pg);
                            getProducts(nxt_pg);
                        }}
                        onPrevious={() => {
                            var prv_pg = current_page - 1;
                            setPage(prv_pg);
                            getProducts(prv_pg);
                        }}
                    ></Pagination>
                    </Stack>
                </Layout.Section>
                <Layout.Section></Layout.Section>
            </Layout>
        </Page>
    );
}

// const s3 = new AWS.S3({
//     accessKeyId: AKIA3VFW4NWAUX6OQXUL,
//     secretAccessKey: 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
// });

// const fileName = 'contacts.csv';

// const uploadFile = () => {
//   fs.readFile(fileName, (err, data) => {
//      if (err) throw err;
//      const params = {
//          Bucket: 'testBucket', // pass your bucket name
//          Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
//          Body: JSON.stringify(data, null, 2)
//      };
//      s3.upload(params, function(s3Err, data) {
//          if (s3Err) throw s3Err
//          console.log(`File uploaded successfully at ${data.Location}`)
//      });
//   });
// };

// uploadFile();

function DataProductsTable({rows, searchType, searchValue, products, callback, onUpdate, onEditClick, onDeleteClick}) {
    const navigate = useNavigate();
    const {replace} = useNavigationHistory();
    const [active, setActive] = useState(true);
    
    

    let store_link = 'https://'+store("shop");
    if (!rows || typeof rows !== "object") {
      rows = [];
    }
    if (searchType !== "all") {
      switch (searchType) {
        case "product_page":
          rows = rows.filter(x => x.upsell_product_page === true);
          break;
        case "cart_page":
          rows = rows.filter(x => x.upsell_in_cart === true);
          break;
        case "post_checkout_page":
          rows = rows.filter(x => x.upsell_post_purchase === true);
          break;
        default:
          break;
      }
    }
    if (searchValue && searchValue.trim() !== "") {
      try {
        rows = rows.filter(x => x.offer_name.match(new RegExp(searchValue, "gi")));
      } catch (e) {
        
      }
    }
    return (
        <div className="products-grid">
            <div className="main">
                <ul className="cards">
                    {rows.map((row) => (
                        <li className="cards_item" onClick={() => { navigate("/product-page/"+row._id); replace({pathname: '/product-page/'+row._id});}}>
                            <div className="card">
                                <div className="card_image"><img src="https://nationaltoday.com/wp-content/uploads/2022/08/Hero-Image-8.png.webp" /></div>
                            </div>
                        </li>
                    ))}
                    <div className="cards_item-dropZone">
                        <span className="dropZone-text">
                            + Add New Pack
                        </span>
                    </div>
                </ul>
            </div>
        </div>
    );
}

const fake_products = [
    {
        "_id": "628266dc423a82ea3bb737b9",
        "store_id": 123,
        "product_id": 134124,
        "ab_testing": false,
        "active": true,
        "start_date": "2020-01-01T05:00:00.000Z",
        "product_name" : "zzzzzzz",
        "placement_type" : "zzzzzzz",
        "run_name": "first run",
    },
    {
        "_id": "6282706c8ad9322c7a8e661a",
        "store_id": 123,
        "product_id": 134123,
        "ab_testing": true,
        "active": true,
        "product_name" : "zzzzzzz",
        "start_date": "2020-01-01T05:00:00.000Z",
        "placement_type" : "zzzzzzz",
        "run_name": "first run"
    }
  ];

  const default_pagination = {
    next_page: null,
    prev_page: null,
    total_records: 10
  };