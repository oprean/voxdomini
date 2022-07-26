<?php
class Model_EventUser extends RedBean_SimpleModel {
    public $name;
    private $_role;
    public function open() {
        //echo $this->name.' || ';
       //$this->_name = 'ddd';
       $this->name = 'ddd';
    }

    public function __set($key, $val) {
        echo $key.$val;
        $this->$key = $val;
    }

    public function __get($key) {
        return $this->$key;
    }

/*    public function &getName() {
        //echo $this->id.' @@ ';
        //$this->name = 'ddd';
        return $this->_name;
     }

     public function setName() {
        //echo $this->id.' @@ ';
        $this->_name = 'ddd';
        //$this->name = 'ddd';
        //return $this->_name;
     }*/
}

