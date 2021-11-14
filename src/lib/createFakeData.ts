/* cSpell: disable */

import Post from '../models/post';

export default function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dictum nibh ac accumsan dapibus. Nullam consequat, neque a scelerisque pretium, lectus erat luctus eros, at porttitor nunc ante a turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed mauris tortor, dictum id ultricies fermentum, maximus et erat. Aliquam sollicitudin suscipit eleifend. Fusce fringilla metus orci, non imperdiet massa porta at. Quisque tincidunt vehicula auctor. Nam bibendum, elit eu tincidunt vehicula, ante augue dapibus dolor, in rhoncus enim eros vel diam.

    Quisque in quam consectetur tellus tincidunt egestas vitae vitae lorem. Quisque sit amet nisi non est sodales consectetur quis ut mi. Etiam ut eros at dui porttitor hendrerit at id ex. Curabitur felis nisl, molestie at placerat quis, fermentum at augue. Nam rhoncus laoreet sem, vitae luctus felis viverra vel. Nam accumsan consectetur ex, et euismod lacus dictum ac. Duis ut auctor lectus, convallis porta arcu. Aliquam eget libero accumsan, vehicula sem ac, pellentesque libero. Aenean facilisis ante sollicitudin tortor porttitor, ac luctus nibh cursus.
    
    Etiam in nunc nunc. Nulla volutpat ullamcorper sodales. Sed nec dui id tortor cursus commodo. Donec nunc erat, tristique sed lectus quis, posuere auctor mi. Cras in nulla id sapien.`,
    tags: ['가짜', '데이터'],
  }));
  Post.insertMany(posts);
}
