import {TopBar, Grid, Thumbnail, Button, EmptyState, SkeletonBodyText, Pagination, Modal, TextField, Badge, FormLayout, Icon, Avatar, Frame, Image, TextStyle, Stack, Tabs, Card, Page, Select, Checkbox, DropZone, Layout} from '@shopify/polaris';
import {ArrowLeftMinor} from '@shopify/polaris-icons';
import {useState, useCallback, useEffect} from 'react';
import logo1 from "../assets/logo.png";
import { ChevronDownMinor, NoteMinor } from "@shopify/polaris-icons";
import { TitleBar, useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import store from "store2";
import { Axios } from  "../Axios";
import { useNavigate } from "react-router";
import {
    announceIcon,
    notification,
    closeImage
  } from '../assets';
  import music1 from "../assets/music1.jpeg";
import '../style.css';

import LoadingSkeleton from "../components/LoadingSkeleton";
// import Header from "./components/Header";

export default function Home() {
    const {replace} = useNavigationHistory();
    const navigate = useNavigate();
    const { show } = useToast();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);

    const [products, setProducts] = useState("");

    // ====================== add pack var ========================

    const [files, setFiles] = useState([]);
    const [price, setPrice] = useState("50.00");
    const [description, setDescription] = useState("");
    const [title_name, setTitleName] = useState("");
    const [genre, setGenre] = useState("");
    const [current_page, setPage] = useState(1);
    const [pagination, setPagination] = useState(default_pagination);

    const handleDescription = useCallback((description) => {setDescription(description)},[description]);
    const handleTitleName = useCallback((title_name) => {setTitleName(title_name)},[title_name]);
    const handleGenre = useCallback((genre) => {setGenre(genre)},[genre]);

    let [priceChecked, setPriceChecked] = useState(false);

    const [creating_product, setCreatingProduct] = useState(false);

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

    

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
  const tabs = [
    {
      id: 'explore_id',
      content: 'Explore',
      accessibilityLabel: 'Explore',
      panelID: 'explore_panel',
    },
    {
        id: 'packs_id',
        content: 'Packs',
        panelID: 'packs_panel',
    },
    {
      id: 'samples_id',
      content: 'Samples',
      panelID: 'samples_panel',
    },
    {
      id: 'selections_id',
      content: 'Selections',
      panelID: 'selections_panel',
    },
    // {
    //     id: 'creators_id',
    //     content: 'Creators',
    //     panelID: 'creators_panel',
    // },
    // {
    //     id: 'mix_id',
    //     content: 'Mix',
    //     panelID: 'mix_panel',
    // },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const steps = tabs;

  

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  );

  const toggleIsSecondaryMenuOpen = useCallback(
    () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
    [],
  );

  const handleSearchResultsDismiss = useCallback(() => {
    setIsSearchActive(false);
    setSearchValue('');
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setIsSearchActive(value.length > 0);
  }, []);

  const handleNavigationToggle = useCallback(() => {
    console.log('toggle navigation visibility');
  }, []);

  const logo = {
    width: 124,
    topBarSource:
      logo1,
    url: '#',
    accessibilityLabel: 'shephbeats',
  };

    const handleDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    function createProductAPI() {
        setLoading(true);
        // const file_name = files[0].name;
        // console.log("files: ", files);
        show("Creating Pack !");
        setActive(false);

        setCreatingProduct(true);
        setPage(1);
        console.log("ss", files[0]);
        const fd = new FormData();
        if (files) {
            fd.append('image', files[0]);
        }

        fd.append('title', title_name);
        fd.append('description', description);
        fd.append('genre', genre);
        fd.append('shop', store("shop"));
        Axios(
            {
                type: "post",
                url: "/merchant/add_product",
                data: fd,
                // headers: {
                //     "Content-Type": "application/json",
                // },
            },
            function (error, success) {
                if (error) {
                    setCreatingProduct(false);
                } else {
                    console.log("success: ",success);
                    if (success && success.success && success.success._id) {
                        
                        setCreatingProduct(false);
                        setActive(true);
                        show("Pack Created Successfully");
                        getProducts(1);
                        setProducts(false);
                        setLoading(false);
                    }
                }
            }
        );
    }

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

    const handlePrice = useCallback(
        (price) => {
            setPrice(price);
        },
        [price]
    );

    const userMenuMarkup = (
        <TopBar.UserMenu
          actions={[
            {
              items: [{content: 'Back to Shopify', icon: ArrowLeftMinor}],
            },
            {
              items: [{content: 'Community forums'}],
            },
          ]}
          name="Dharma"
          detail="Jaded Pixel"
          initials="D"
          open={isUserMenuOpen}
          onToggle={toggleIsUserMenuOpen}
        />
      );
    
    //   const searchResultsMarkup = (
    //     <ActionList
    //       items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
    //     />
    //   );
    
      const searchFieldMarkup = (
        <TopBar.SearchField
          onChange={handleSearchChange}
          value={searchValue}
          placeholder="Search"
          showFocusBorder
        />
      );
    const secondaryMenuMarkup = (
        <TopBar.Menu
          activatorContent={
            <span className='home-topbar'>
                <Stack>
                    <Button primary onClick={handleChange}>+ Add New Pack</Button>
                    <Image source={announceIcon} height={14} />
                    <Image source={notification} height={14} />
                    <Avatar customer name="Farrah" />
                    <Icon source={ChevronDownMinor} />
                </Stack>
            </span>
          }
        //   open={isSecondaryMenuOpen}
        //   onOpen={toggleIsSecondaryMenuOpen}
        //   onClose={toggleIsSecondaryMenuOpen}
        //   actions={[
        //     {
        //       items: [{content: 'Community forums'}],
        //     },
        //   ]}
        />
      );

    const topBarMarkup = (
        <TopBar
          showNavigationToggle
        //   userMenu={userMenuMarkup}
          secondaryMenu={secondaryMenuMarkup}
          searchResultsVisible={isSearchActive}
          searchField={searchFieldMarkup}
        //   searchResults={searchResultsMarkup}
          onSearchResultsDismiss={handleSearchResultsDismiss}
          onNavigationToggle={handleNavigationToggle}
        />
      );

      



      if (loading) {
        return (
            <Page>
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
            </Page>
        )
    }

    function getStepContent(stepIndex) {
        console.log("stepIndex:", stepIndex);
        switch (stepIndex) {
            case 0:
                return <Grid>
                {products && products.map((product, index) => (
                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}} key={index}>
                        <Card>
                            <div className="pack-detail-page" onClick={() => { navigate("/pack-page/"+product.pack_id); replace({pathname: '/pack-page/'+product.pack_id});}} style={{cursor: 'pointer'}}>
                                {/* <Card.Section> */}
                                <img src={product.image_src} />
                                {/* </Card.Section> */}
                            </div>
                        </Card>
                    </Grid.Cell>
                ))}
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
                    <div className="cards_item-dropZone" onClick={handleChange} style={{cursor: "pointer"}}>
                        <span className="dropZone-text">
                            + Add New Pack
                        </span>
                    </div>
                </Grid.Cell>
            </Grid>
            case 1:
                return <Grid>
                            {products && products.map((product, index) => (
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}} key={index}>
                                    <Card>
                                        <div className="pack-detail-page" onClick={() => { navigate("/pack-page/"+product.pack_id); replace({pathname: '/pack-page/'+product.pack_id});}} style={{cursor: 'pointer'}}>
                                            {/* <Card.Section> */}
                                                <img src={product.image_src} />
                                            {/* </Card.Section> */}
                                        </div>
                                    </Card>
                                </Grid.Cell>
                            ))}
                            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
                                <div className="cards_item-dropZone" onClick={handleChange} style={{cursor: "pointer"}}>
                                    <span className="dropZone-text">
                                        + Add New Pack
                                    </span>
                                </div>
                            </Grid.Cell>
                        </Grid>
                
            case 2:
                return <TextStyle>Packs</TextStyle>;
            case 3:
                return <TextStyle>Selections</TextStyle>;
            default:
                return 'Unknown stepIndex';
        }
    }

    return (
        <div className='shephbeats-home'>
            <Page fullWidth>
                <Frame topBar={topBarMarkup} logo={logo}>
                    <Card>
                        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                            <Card.Section title={tabs[selected].content}>
                                {activeStep === steps.length ? (
                                    setLoading(true)
                                    ) : (
                                        <div>
                                            {getStepContent(selected)}
                                        </div>
                                    )
                                }
                            </Card.Section>
                        </Tabs>
                    </Card>
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
                </Frame>
            </Page>
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
                                            <TextField
                                                type="number"
                                                label=""
                                                value={price}
                                                onChange={handlePrice}
                                                prefix="$"
                                                autoComplete="off"
                                            />
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
        </div>
    );
}

const default_pagination = {
    next_page: null,
    prev_page: null,
    total_records: 10
  };