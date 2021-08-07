pragma solidity ^0.5.0;

contract TomShare {
    // Code goes here...
    string public name;
    uint256 public postCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string caption;
        uint256 tomAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string caption,
        uint256 tomAmount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string caption,
        uint256 tomAmount,
        address payable author
    );

    constructor() public {
        name = "TomShare";
    }

    function uploadImage(string memory _imgHash, string memory _caption)
        public
    {
        require(bytes(_imgHash).length > 0);
        require(bytes(_caption).length > 0);
        require(msg.sender != address(0x0));
        postCount++;
        images[postCount] = Image(postCount, _imgHash, _caption, 0, msg.sender);

        emit ImageCreated(postCount, _imgHash, _caption, 0, msg.sender);
    }

    function tipOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= postCount);
        Image memory _image = images[_id];
        address payable _author = _image.author;
        address(_author).transfer(msg.value);
        _image.tomAmount = _image.tomAmount + msg.value;
        images[_id] = _image;
        emit ImageTipped(
            _id,
            _image.hash,
            _image.caption,
            _image.tomAmount,
            _author
        );
    }
}
